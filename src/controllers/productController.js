const mongoose = require("mongoose");
const Product = require("../models/Product");

function validId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) { next(error); }
}

async function getProducts(req, res, next) {
  try {
    const { category, search, sort, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));
    const allowedSorts = ["name", "price", "quantity", "createdAt"];
    const sortField = allowedSorts.includes(sort) ? sort : "createdAt";

    const products = await Product.find(filter)
      .sort({ [sortField]: 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    const total = await Product.countDocuments(filter);

    res.json({ products, page: pageNumber, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) });
  } catch (error) { next(error); }
}

async function getProduct(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid product ID" });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) { next(error); }
}

async function updateProduct(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid product ID" });
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) { next(error); }
}

async function changeStock(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid product ID" });
    const change = Number(req.body.change);
    if (!Number.isInteger(change) || change === 0) {
      return res.status(400).json({ message: "change must be a non-zero whole number" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.quantity + change < 0) {
      return res.status(400).json({ message: "Not enough stock for this adjustment" });
    }

    product.quantity += change;
    await product.save();
    res.json(product);
  } catch (error) { next(error); }
}

async function deleteProduct(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid product ID" });
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) { next(error); }
}

async function getLowStock(req, res, next) {
  try {
    const products = await Product.find({ $expr: { $lte: ["$quantity", "$reorderLevel"] } }).sort({ quantity: 1 });
    res.json(products);
  } catch (error) { next(error); }
}

async function getSummary(req, res, next) {
  try {
    const summary = await Product.aggregate([
      { $group: {
        _id: "$category",
        productCount: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" },
        inventoryValue: { $sum: { $multiply: ["$price", "$quantity"] } }
      }},
      { $sort: { _id: 1 } }
    ]);
    res.json(summary);
  } catch (error) { next(error); }
}

module.exports = { createProduct, getProducts, getProduct, updateProduct, changeStock, deleteProduct, getLowStock, getSummary };

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Product name is required"], trim: true },
  sku: { type: String, required: [true, "SKU is required"], unique: true, trim: true, uppercase: true },
  category: { type: String, required: [true, "Category is required"], trim: true },
  price: { type: Number, required: [true, "Price is required"], min: [0, "Price cannot be negative"] },
  quantity: {
    type: Number, required: [true, "Quantity is required"], min: [0, "Quantity cannot be negative"],
    validate: { validator: Number.isInteger, message: "Quantity must be a whole number" }
  },
  reorderLevel: { type: Number, default: 10, min: [0, "Reorder level cannot be negative"] }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);

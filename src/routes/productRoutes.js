const express = require("express");
const {
  createProduct, getProducts, getProduct, updateProduct,
  changeStock, deleteProduct, getLowStock, getSummary
} = require("../controllers/productController");

const router = express.Router();

router.route("/").post(createProduct).get(getProducts);
router.get("/low-stock", getLowStock);
router.get("/summary", getSummary);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.patch("/:id/stock", changeStock);
router.delete("/:id", deleteProduct);

module.exports = router;

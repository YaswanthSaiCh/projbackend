const express = require("express");
const { getUserById } = require("../controllers/user");
const {
  getProductById,
  createProduct,
  getProduct,
  getProductPhoto,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const router = express.Router();

router.param("userId", getUserById);
router.param("productId", getProductById);

router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", getProductPhoto);
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);
router.delete(
  "/product/delete/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);
router.get("/allproducts", getAllProducts);
router.get("/product/all/categories", getAllUniqueCategories);

module.exports = router;

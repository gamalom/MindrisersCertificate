const {
  createProduct,
} = require("../controller/admin/product/productCotroller");

const isAuthenticated = require("../middleware/isAutheticated");
const restrictTo = require("../middleware/restrictTo");

const router = require("express").Router();

router
  .route("/product")
  .post(isAuthenticated, restrictTo("admin"), createProduct);

module.exports = router;

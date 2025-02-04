const {
  createProduct,
} = require("../controller/admin/product/productCotroller");

const isAuthenticated = require("../middleware/isAutheticated");
const restrictTo = require("../middleware/restrictTo");

const { multer, storage } = require("../middleware/multerConfig");
const upload = multer({ storage: storage });

const router = require("express").Router();

router
  .route("/product")
  .post(
    isAuthenticated,
    restrictTo("admin"),
    upload.single("productImage"),
    createProduct
  );

module.exports = router;

const {
  getProductReview,
  createReview,
  deleteReview,
} = require("../controller/user/userConroller");
const isAuthenticated = require("../middleware/isAuthenticated");
const restrictTo = require("../middleware/restrictTo");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();

router
  .route("/reviews/:id")
  .get(catchAsync(getProductReview))
  .post(isAuthenticated, catchAsync(createReview))
  .delete(isAuthenticated, restrictTo("admin"), catchAsync(deleteReview));

module.exports = router;

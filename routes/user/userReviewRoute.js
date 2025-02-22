const {
  getMyReviews,
  deleteReview,
  createReview,
} = require("../../controller/user/review/reviewController");

const isAuthenticated = require("../../middleware/isAuthenticated");
const restrictTo = require("../../middleware/restrictTo");
const catchAsync = require("../../services/catchAsync");

const router = require("express").Router();

router.route("/").get(isAuthenticated, catchAsync(getMyReviews));
router
  .route("/:id")
  .post(isAuthenticated, catchAsync(createReview))
  .delete(isAuthenticated, restrictTo("admin"), catchAsync(deleteReview));

module.exports = router;

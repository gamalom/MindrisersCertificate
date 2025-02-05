const Product = require("../../model/productModel");
const Review = require("../../model/reviewModel");

exports.createReview = async (req, res) => {
  const userId = req.user.id;
  const { rating, message } = req.body;
  const productId = req.params.id;
  console.log(req.body, productId);
  if (!rating || !message || !productId) {
    return res.status(400).json({
      message: "Please provide rating,message,productId",
    });
  }
  // check if that productId product exists or not
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return res.status(404).json({
      message: "Product with that productId doesnot exist",
    });
  }
  // insert them into Review
  await Review.create({
    userId,
    productId,
    rating,
    message,
  });
  res.status(200).json({
    message: "Review added successfully",
  });
};

exports.getProductReview = async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({
      message: "Please provide productId",
    });
  }

  const productExist = await Product.findById(productId);

  if (!productExist) {
    return res.status(404).json({
      message: "Product with that ID doesn't exist",
    });
  }

  const reviews = await Review.find({ productId });

  res.status(200).json({
    message: "Review fetched successfully",
    data: reviews,
  });
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  // check if that user created this review
  const userId = req.user.id;
  if (!reviewId) {
    res.status(400).json({
      message: "Please provide reviewId ",
    });
  }

  const review = Review.findById(reviewId);
  const ownerIdOfReview = review.userId;
  // if (ownerIdOfReview !== userId) {
  //   return res.status(400).json({
  //     message: "You dont have Permission for delete this review",
  //   });
  // }

  await Review.findByIdAndDelete(reviewId);
  res.status(200).json({
    message: "Review delete successfully",
  });
};

const Product = require("../../../model/productModel");
const User = require("../../../model/userModel");

exports.addToCart = async (req, res) => {
  //userId and product id
  const userId = req.user.id;
  const productId = req.params.productId;
  if (!productId) {
    return res.status(400).json({
      message: "Please provide the productId",
    });
  }
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return res.status(404).json({
      message: "No product with that productId Found",
    });
  }
  const user = await User.findById(userId);
  user.cart.push(productId);
  await user.save();
  res.status(200).json({
    message: "Product added to cart successfully",
  });
};

exports.getMyCartItems = async (req, res) => {
  const userId = req.user.id;
  const userData = await User.findById(userId).populate({
    path: "cart",
    select: "-productStatus",
  });
  res.status(200).json({
    message: "Data fetch successfully",
    data: userData.cart,
  });
};

exports.deleteItemFromCart = async (req, res) => {
  const { productId } = req.params;
  const { productIds } = req.body;
  const userId = req.user.id;
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      message: "No product with that productId Found",
    });
  }
  //get user cart
  const user = await User.findById(userId);
  productIds.forEach((productIdd) => {
    user.cart.filter((pId) => {
      pId != productIdd;
    });
  });

  await user.save();
  res.status(200).json({
    message: "Item remove successfully",
  });
};

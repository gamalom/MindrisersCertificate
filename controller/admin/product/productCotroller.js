const Product = require("../../../model/productModel");

exports.createProduct = async (req, res) => {
  const {
    productName,
    productDescription,
    productPrice,
    productStatus,
    productStockQty,
  } = req.body;
  if (
    !productName ||
    !productPrice ||
    !productDescription ||
    !productStatus ||
    !productStockQty
  ) {
    return res.status(400).json({
      message:
        "Please provide productName, productDescription,productPrice, productStatus, productStockQty ",
    });
  }

  //insert into table
  await Product.create({
    productName,
    productPrice,
    productDescription,
    productStatus,
    productStockQty,
  });
  res.status(200).json({
    message: "Product table is created successfully",
  });
};

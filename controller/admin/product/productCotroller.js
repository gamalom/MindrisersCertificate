const Product = require("../../../model/productModel");

exports.createProduct = async (req, res) => {
  const file = req.file;
  let filePath;
  if (!file) {
    filePath = "";
  } else {
    filePath = req.file.filename;
  }

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
    productImage: "http://localhost:3000/" + filePath,
  });
  res.status(200).json({
    message: "Product table is created successfully",
  });
};

const Product = require("../../../model/productModel");
const fs = require("fs");

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
    productImage: process.env.BACKEND_URL + filePath,
  });
  res.status(200).json({
    message: "Product table is created successfully",
  });
};

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  if (products.length == 0) {
    res.status(400).json({
      message: "No product found",
      products: [],
    });
  } else {
    res.status(200).json({
      message: "Products Found",
      products,
    });
  }
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide id(ProductID)",
    });
  }

  const product = await Product.find({ _id: id });

  if (product.length == 0) {
    return res.status(400).json({
      message: "No product found with that id",
      product: [],
    });
  } else {
    res.status(200).json({
      message: "Product fetch sucessfully",
      product,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide ProductID",
    });
  }
  const oldData = await Product.findById(id);
  if (!oldData) {
    return res.status(404).json({
      message: "No data found with that id",
    });
  }

  const oldProductImage = oldData.productImage; // http://localhost:3000/1698943267271-bunImage.png"
  const lengthToCut = process.env.BACKEND_URL.length;
  const finalFilePathAfterCut = oldProductImage.slice(lengthToCut);
  // REMOVE FILE FROM UPLOADS FOLDER
  fs.unlink("./uploads/" + finalFilePathAfterCut, (err) => {
    if (err) {
      console.log("error deleting file", err);
    } else {
      console.log("file deleted successfully");
    }
  });
  await Product.findByIdAndDelete(id);
  res.status(200).json({
    message: "Product Delete sucessfully",
  });
};

exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const {
    productName,
    productDescription,
    productPrice,
    productStatus,
    productStockQty,
  } = req.body;
  if (
    !productName ||
    !productDescription ||
    !productPrice ||
    !productStatus ||
    !productStockQty ||
    !id
  ) {
    return res.status(400).json({
      message:
        "Please provide productName,productDescription,productPrice,productStatus,productStockQty,id",
    });
  }
  const oldData = await Product.findById(id);
  if (!oldData) {
    return res.status(404).json({
      message: "No data found with that id",
    });
  }

  const oldProductImage = oldData.productImage; // http://localhost:3000/1698943267271-bunImage.png"
  const lengthToCut = process.env.BACKEND_URL.length;
  const finalFilePathAfterCut = oldProductImage.slice(lengthToCut); // 1698943267271-bunImage.png
  if (req.file && req.file.filename) {
    // REMOVE FILE FROM UPLOADS FOLDER
    fs.unlink("./uploads/" + finalFilePathAfterCut, (err) => {
      if (err) {
        console.log("error deleting file", err);
      } else {
        console.log("file deleted successfully");
      }
    });
  }
  const datas = await Product.findByIdAndUpdate(
    id,
    {
      productName,
      productDescription,
      productPrice,
      productStatus,
      productStockQty,
      productImage:
        req.file && req.file.filename
          ? process.env.BACKEND_URL + req.file.filename
          : oldProductImage,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    messagee: "Product updated successfully",
    data: datas,
  });
};

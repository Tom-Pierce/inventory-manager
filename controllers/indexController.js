const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const Category = require("../models/category");

exports.index = asyncHandler(async (req, res, next) => {
  const [numProducts, numCategories] = await Promise.all([
    Product.countDocuments().exec(),
    Category.countDocuments().exec(),
  ]);
  res.render("index", {
    title: "Inventory Manager",
    num_products: numProducts,
    num_categories: numCategories,
  });
});

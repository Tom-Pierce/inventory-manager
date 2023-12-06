const Product = require("../models/product");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.product_list = asyncHandler(async (req, res, next) => {
  const products = await Product.find().exec();

  res.render("products/product_list", {
    title: "Product List",
    product_list: products,
  });
});

exports.product_detail = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .exec();
  if (product === null) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }
  res.render("products/product_detail", {
    product: product,
  });
});

exports.product_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ name: 1 }).exec();

  res.render("products/product_form", {
    title: "New Product",
    category_list: categories,
  });
});

exports.product_create_post = [
  body("name", "Product name cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("description", "Product description cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("price", "Price can not be higher than $9999")
    .trim()
    .isInt({ max: 9999 })
    .escape(),

  body("price", "Price cannot be negative").trim().isInt({ min: 0 }).escape(),

  body("stock", "Stock cannot be negative").trim().isInt({ min: 0 }).escape(),

  body("category").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const categories = await Category.find().sort({ name: 1 }).exec();

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      res.render("products/product_form", {
        title: "New Product",
        category_list: categories,
        product: product,
        errors: errors.array(),
      });
      return;
    } else {
      product.save();
      res.redirect(product.url);
    }
  }),
];

exports.product_update_get = asyncHandler(async (req, res, next) => {
  const [product, allCategories] = await Promise.all([
    Product.findById(req.params.id).exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  res.render("products/product_form", {
    title: "Update Product",
    product: product,
    category_list: allCategories,
  });
});

exports.product_update_post = [
  body("name", "Product name cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("description", "Product description cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("price", "Price can not be higher than $9999")
    .trim()
    .isInt({ max: 9999 })
    .escape(),

  body("price", "Price cannot be negative").trim().isInt({ min: 0 }).escape(),

  body("stock", "Stock cannot be negative").trim().isInt({ min: 0 }).escape(),

  body("category").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const categories = await Category.find().sort({ name: 1 }).exec();

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      res.render("products/product_form", {
        title: "Update Product",
        category_list: categories,
        product: product,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          stock: req.body.stock,
          category: req.body.category,
        },
        {}
      );
      res.redirect(updatedProduct.url);
    }
  }),
];

exports.product_remove_get = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (product === null) {
    res.redirect("/inventory/products");
  }
  res.render("products/product_remove", {
    title: "Remove Product",
    product: product,
  });
});

exports.product_remove_post = asyncHandler(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/inventory/products");
});

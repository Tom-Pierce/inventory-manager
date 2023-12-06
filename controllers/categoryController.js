const Category = require("../models/category");
const Product = require("../models/product");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().exec();

  res.render("categories/category_list", {
    title: "Categories",
    category_list: categories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, categoryProducts] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  res.render("categories/category_detail", {
    category: category,
    category_products: categoryProducts,
  });
});

exports.category_create_get = (req, res, next) => {
  res.render("categories/category_form", { title: "Create Category" });
};

exports.category_create_post = [
  body("name", "Category must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  body("description", "Description must be longer than 70 letters")
    .trim()
    .isLength({ min: 70 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      res.render("categories/category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({
        name: req.body.name,
      })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (categoryExists) res.redirect(categoryExists.url);
      else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error("Category cannot be found");
    err.status = 404;
    return next(err);
  }

  console.log(category);

  res.render("categories/category_form", {
    title: "Update Category",
    category: category,
  });
});

exports.category_update_post = [
  body("name", "Category must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  body("description", "Description must be longer than 70 letters")
    .trim()
    .isLength({ min: 70 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      res.render("categories/category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          description: req.body.description,
        },
        {}
      );
      res.redirect(updatedCategory.url);
    }
  }),
];

exports.category_remove_get = asyncHandler(async (req, res, next) => {
  const [category, categoryProducts] = await Promise.all([
    Category.findById(req.params.id),
    Product.find({ category: req.params.id }),
  ]);
  if (category === null) {
    res.redirect("/inventory/categories");
  }

  res.render("categories/category_remove", {
    title: "Remove category",
    category: category,
    category_products: categoryProducts,
  });
});

exports.category_remove_post = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/inventory/categories");
});

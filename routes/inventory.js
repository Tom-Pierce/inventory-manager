const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");

router.get("/", indexController.index);

router.get("/categories", categoryController.category_list);

router.get("/category/create", categoryController.category_create_get);

router.post("/category/create", categoryController.category_create_post);

router.get("/category/:id/update", categoryController.category_update_get);

router.post("/category/:id/update", categoryController.category_update_post);

router.get("/category/:id/remove", categoryController.category_remove_get);

router.post("/category/:id/remove", categoryController.category_remove_post);

router.get("/category/:id", categoryController.category_detail);

router.get("/products", productController.product_list);

router.get("/product/create", productController.product_create_get);

router.post("/product/create", productController.product_create_post);

router.get("/product/:id/update", productController.product_update_get);

router.post("/product/:id/update", productController.product_update_post);

router.get("/product/:id/remove", productController.product_remove_get);

router.post("/product/:id/remove", productController.product_remove_post);

router.get("/product/:id", productController.product_detail);

module.exports = router;

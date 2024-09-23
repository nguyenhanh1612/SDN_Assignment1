const express = require("express");
const bodyParser = require("body-parser");
const Product = require("../models/product");
const Category = require("../models/category");

const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter
    .route("/")
    .get((req, res, next) => {
        Product.find({})
            .populate('category')
            .then(products => {
                res.status(200).json(products);
            })
            .catch(next);
    })
    .post((req, res, next) => {
        Product.create(req.body)
            .then(product => {
                return Category.findByIdAndUpdate(
                    req.body.category,
                    { $push: { products: product._id } },
                    { new: true }
                );
            })
            .then(updatedCategory => {
                res.status(201).json(updatedCategory);
            })
            .catch(next);
    })
    .delete(async (req, res, next) => {
        try {
            const products = await Product.find({});
            const productIds = products.map(product => product._id);

            await Product.deleteMany({});
            
            if (productIds.length > 0) {
                await Category.updateMany(
                    { products: { $in: productIds } },
                    { $pull: { products: { $in: productIds } } }
                );
            }

            res.status(200).json({ message: "All products deleted and categories updated." });
        } catch (err) {
            next(err);
        }
    });

productRouter
    .route("/:productId")
    .get((req, res, next) => {
        Product.findById(req.params.productId)
            .populate('category')
            .then(product => {
                if (product) {
                    res.status(200).json(product);
                } else {
                    const err = new Error("Product not found");
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(next);
    })
    .put((req, res, next) => {
        Product.findByIdAndUpdate(req.params.productId, req.body, { new: true })
            .then(product => {
                res.status(200).json(product);
            })
            .catch(next);
    })
    .delete(async (req, res, next) => {
        try {
            const product = await Product.findOneAndDelete({ _id: req.params.productId });
            console.log("Deleted product:", product);
            if (product) {
                console.log("Product category ID:", product.category);
                // Cập nhật Category trực tiếp nếu middleware không hoạt động
                await Category.findByIdAndUpdate(
                    product.category,
                    { $pull: { products: product._id } },
                    { new: true }
                );
                res.status(200).json({ message: "Product deleted and category updated.", product });
            } else {
                const err = new Error("Product not found");
                err.status = 404;
                return next(err);
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            next(err);
        }
    });

module.exports = productRouter;

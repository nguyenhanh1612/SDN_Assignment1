const express = require("express");
const bodyParser = require("body-parser");
const Category = require("../models/category");
const Product = require("../models/product");

const categoryRouter = express.Router();

categoryRouter.use(bodyParser.json());

categoryRouter
    .route("/")
    .get((req, res, next) => {
        Category.find({})
            .populate('products')
            .then(categories => {
                res.status(200).json(categories);
            })
            .catch(next);
    })
    .post((req, res, next) => {
        Category.create(req.body)
            .then(category => {
                res.status(201).json(category);
            })
            .catch(next);
    })
    .delete((req, res, next) => {
        Category.deleteMany({})
            .then(response => {
                res.status(200).json(response);
            })
            .catch(next);
    });

categoryRouter
    .route("/:categoryId")
    .get((req, res, next) => {
        Category.findById(req.params.categoryId)
            .populate('products')
            .then(category => {
                if (category) {
                    res.status(200).json(category);
                } else {
                    const err = new Error("Category not found");
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(next);
    })
    .put((req, res, next) => {
        Category.findByIdAndUpdate(req.params.categoryId, req.body, { new: true })
            .then(category => {
                res.status(200).json(category);
            })
            .catch(next);
    })
    .delete((req, res, next) => {
        Category.findByIdAndDelete(req.params.categoryId)
            .then(response => {
                res.status(200).json(response);
            })
            .catch(next);
    });

module.exports = categoryRouter;

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const categoryRouter = require("./routes/categoryRouter");
const productRouter = require("./routes/productRouter");

const app = express();

mongoose.connect("mongodb://localhost:27017/assignment1")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

app.use(bodyParser.json());

app.use("/categories", categoryRouter);
app.use("/products", productRouter);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

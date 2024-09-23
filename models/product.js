const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
});

productSchema.post('findOneAndDelete', async function(doc, next) {
    if (doc) {
        console.log("Middleware: Deleting product", doc._id, "from category", doc.category);
        try {
            const updatedCategory = await mongoose.model('Category').findByIdAndUpdate(
                doc.category,
                { $pull: { products: doc._id } },
                { new: true }
            );
            console.log("Middleware: Updated category:", updatedCategory);
            next();
        } catch (err) {
            console.error("Middleware: Error updating category:", err);
            next(err);
        }
    } else {
        console.log("Middleware: No document found to delete.");
        next();
    }
});


const Product = mongoose.model("Product", productSchema);
module.exports = Product;

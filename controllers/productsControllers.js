const Product = require('../models/Products');

module.exports = {
    createProduct: async (req, res) => {
        const newProduct = new Product(req.body);
        try {
            await newProduct.save();
            res.status(200).json("Product Created Succesfully")
        } catch (error) {
            res.status(500).json("Failed to Create Product")
        }
    },
    getAllProduct: async (req, res) => {
        try {
            const products = await Product.find({}).sort({ createdAt: -1 })
            res.status(200).json({products})
        } catch (error) {
            res.status(500).json("Failed to get Products all")
        }
    },
    getProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id)
            res.status(200).json(product)
        } catch (error) {
            res.status(500).json("Failed to get Product by id")
        }
    },
    searchProduct: async (req, res) => {
        try {
            const searchedProducts = await Product.find({ supplier: req.params.key} ).exec();
            res.status(200).json({searchedProducts})

            // const result = Product.aggregate(
            //     [
            //         {
            //             $search: {
            //                 index: "MyShopApp",
            //                 text: {
            //                     query: req.params.key,
            //                     path: {
            //                         wildcard: "*"
            //                     }
            //                 }
            //             }
            //         }
            //     ]
            // )

            // res.status(200).json(result)
        } catch (error) {
            res.status(500).json("Failed to get Products search")
        }
    }
}
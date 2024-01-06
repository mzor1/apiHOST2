const Product = require('../models/Products');
const Cart = require('../models/Cart');


module.exports = {
    addToCart: async (req, res) => {
        const { userId, cartItem, quantity } = req.body;

        try {
            const cart = await Cart.findOne({ userId });
            console.log("userid ____", userId)
            console.log("car____", cart)
            if (cart) {
                const existingProduct = cart.products.find(
                    (product) => product.cartItem.toString() === cartItem
                );
                if (existingProduct) {
                    existingProduct.quantity += quantity
                } else {
                    cart.products.push({ cartItem, quantity })
                }
                await cart.save();
                res.status(200).json("ürün eklendi to cart")
            } else {
                const newCart = new Cart({
                    userId,
                    products: [{
                        cartItem, quantity: quantity
                    }]
                });


                await newCart.save();
                res.status(200).json("Cart oluşturuldu, ürün eklendi")

            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    },
    getCart: async (req, res) => {
        const userId = req.params.id;
        try {
            const cart = await Cart.find({ userId })
                .populate('products.cartItem', "_id title supplier price imageUrl")

            res.status(200).json(cart)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    deleteCartItem: async (req, res) => {
        const cartItemId = req.params.cartItemId;

        try {
            const updatedCart = await Cart.findOneAndUpdate(
                { 'products._id': cartItemId },
                {$pull:{products:{_id:cartItemId}}},
                { new: true }
            );
            if(!updatedCart){
                return res.status(404).json("cart item bulunamadı")
            }

            res.status(200).json(updatedCart)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    decrementCartItem: async (req, res) => {
        const { userId, cartItem } = req.body;

        try {
            const cart = await Cart.findOne({ userId });
            console.log("_____ee")
            if (!cart) {
                return res.status(404).json("Cart bulunamadı")
            }
            console.log("_____tttt")
            const existingProduct = await cart.products.find(
                (product) => product.cartItem.toString() === cartItem
            );
            console.log("_____ccc")
            if (!existingProduct) {
                return res.status(404).json("ürün bulunamadı")
            };

            if (existingProduct.quantity === 1) {
                cart.products = cart.products.filter(
                    (product) => product.cartItem.toString() !== cartItem
                )
            } else {
                existingProduct.quantity -= 1;
            }

            await cart.save();

            if(existingProduct.quantity===0){
                await Cart.updateOne(
                    {userId},
                    {$pull:{products:{cartItem}}}
                )
            }
            res.status(200).json("ürün güncellendi")
        } catch (error) {
            res.status(500).json(error)
        }
    },
}
const User = require("../models/User");

const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = {
    createUser: async (req, res) => {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            location: req.body.location,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString(),
        });
        try {
            await newUser.save();

            res.status(201).json({ message: "User succesfully created" })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    },
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res.status(401).json("Lütfen geçerli bir email giriniz");
            }


            const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const decryptedpass = decryptedPassword.toString(CryptoJS.enc.Utf8);

            if (decryptedpass !== req.body.password) {
                return res.status(401).json("Şifre Hatalı");
            }

            const userToken = jwt.sign(
                {
                    id: user.id
                }, process.env.JWT_SECRET, { expiresIn: "7d" }
            );

            const { password, __v, createdAt, updatedAt, ...userData } = user._doc;

            res.status(200).json({ ...userData, token: userToken })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    },
}
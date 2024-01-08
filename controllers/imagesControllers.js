const Image = require('../models/Image');
const Product = require('../models/Products');
const fs = require('fs');


module.exports = {
    uploadImage: async (req, res) => {
        
        try {
            // console.log("bb_____",req);
            const { file } = req;
            console.log("qq_____",file);
            if (!file) {
                console.log("___ee__",file);
                return res.status(400).json("no image file provided");
            }

            console.log("___ib__");
            // const imageBuffer = fs.readFileSync(file.path);
            const imageBuffer = file.buffer;

            console.log("___ib__",imageBuffer);
            const base64Image = imageBuffer.toString('base64');

            console.log("___bs64__");
            // fs.unlinkSync(file.path);

            // console.log("___fp__",file.path);
            const newImage = new Image({
                image: base64Image,
            });

            console.log("___ni__",newImage);
            await newImage.save();
            return res.status(200).json("Image uploaded Succesfully")
        } catch (error) {
            console.log("_-_-_ _-_-_",error)
            return res.status(500).json("Failed to upload image")
        }
    },
    getImages: async (req, res) => {
        try {
          const images = await Image.find().select('image createdAt'); // You can adjust the fields as needed
    
          if (!images || images.length === 0) {
            return res.status(404).json("No images found");
          }
    
          const formattedImages = images.map(image => ({
            _id: image._id,
            createdAt: image.createdAt,
            image: `data:image/jpeg;base64,${image.image}`, // Adjust the data URI as per your image format
          }));
    
          res.status(200).json(formattedImages);
        } catch (error) {
          console.error(error);
          res.status(500).json("Failed to get images");
        }
      },
};
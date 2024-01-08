const router = require('express').Router();
const multer = require('multer');
const imageController = require("../controllers/imagesControllers");

const storage = multer.memoryStorage(); // This stores the file in memory as a Buffer
const upload = multer({ storage: storage });

router.post('/',upload.single('image'), imageController.uploadImage);
router.get('/images', imageController.getImages);

module.exports = router;
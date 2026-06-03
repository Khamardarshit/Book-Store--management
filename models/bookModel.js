const { name } = require('ejs')
const mongoose = require('mongoose')
const multer = require('multer');
const path = require('path');
const imagePath = "/uploads"

const bookSchema = new mongoose.Schema({
    bookTitle: {
        type: String,
        require: true,
    },
    bookAuthor: {
        type: String,
        require: true,
    },
    bookCategory: {
        type: String,
        require: true,
    },
    bookPrice: {
        type: Number,
        require: true,
    },
    bookQty: {
        type: Number,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    coverImage: {
        type: String,
        require: true,
    },
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", imagePath))
    },
    filename: function (req, file, cb) {
        const Bname = Date.now() + "-" + file.originalname;
        cb(null, Bname);
    }
})

bookSchema.statics.imagePath = imagePath;
bookSchema.statics.uploadImage = multer({
    storage: storage
}).single("coverImage")

const Book = mongoose.model('book', bookSchema);
module.exports = Book;
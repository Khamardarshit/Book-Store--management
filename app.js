const express = require('express')

const mongoose = require('mongoose')

const app = express();

const Book = require('./models/bookModel')

const path = require('path');

const fs = require('fs');

mongoose.connect('mongodb://localhost:27017/book-management')
    .then(() => {
        console.log("MongoDB Server Connected")
    })
    .catch((err) => {
        console.log("There Are Any Error While MongoDB Connection...")
        console.log(err)
    })

const port = 8000;

app.set('view engine', 'ejs')

app.use(express.urlencoded());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', async (req, res) => {

    const book = await Book.find();

    return res.render('index', {
        book
    });

});

app.get('/viewBook', async (req, res) => {
    const book = await Book.find();

    return res.render('view-book', { book });
})

app.get('/addBook', (req, res) => {
    return res.render('add-book');
})

app.post('/insertData', Book.uploadImage, async (req, res) => {

    console.log(req.body);
    console.log(req.file);

    req.body.coverImage = req.file
        ? Book.imagePath + "/" + req.file.filename
        : "";

    await Book.create(req.body);

    return res.redirect('/');
})

app.get('/deleteBook/:id', async (req, res) => {
    const id = req.params.id;

    const singleBook = await Book.findById(req.params.id);

    fs.unlinkSync("." + singleBook.coverImage);

    await Book.findByIdAndDelete(id);

    return res.redirect('/');
})

app.get('/editBook/:id', async (req, res) => {
    const singleBook = await Book.findById(req.params.id);
    return res.render('edit-book', {
        singleBook
    })
})

app.post('/updateBook/:id', Book.uploadImage, async (req, res) => {

    const id = req.params.id;

    const singleBook = await Book.findById(id);

    const {
        bookTitle,
        bookAuthor,
        bookCategory,
        bookPrice,
        bookQty,
        description
    } = req.body;

    let coverImage = singleBook.coverImage;

    // if new image uploaded
    if (req.file) {

        // delete old image from uploads folder
        fs.unlinkSync("." + singleBook.coverImage);

        // save new image path
        coverImage = Book.imagePath + "/" + req.file.filename;
    }

    await Book.findByIdAndUpdate(id, {
        bookTitle,
        bookAuthor,
        bookCategory,
        bookPrice,
        bookQty,
        description,
        coverImage
    });

    return res.redirect('/');
})

app.get('/viewDetails/:id', async (req, res) => {

    const singleBook = await Book.findById(req.params.id);

    return res.render('view-details', {
        singleBook
    });

});


app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`Server Is Running On Port ${port}`);
        console.log("http://localhost:8000");
    }
})
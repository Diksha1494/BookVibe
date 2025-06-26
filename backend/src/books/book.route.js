// book.route.js
const express = require('express');
const router = express.Router();
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteABook } = require('./book.controller'); // ✅ CORRECT IMPORT
const verifyAdminToken = require('../middleware/verifyAdminToken');

router.post("/create-book", verifyAdminToken, postABook);

//get all book
router.get("/",getAllBooks);
//single book endpoint
router.get("/:id",getSingleBook);

//update a book endpoint
router.put("/edit/:id",verifyAdminToken,UpdateBook);
router.delete("/delete/:id",verifyAdminToken,deleteABook);
module.exports = router;

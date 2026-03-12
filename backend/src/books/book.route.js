const express = require('express');
const router = express.Router();
const {
  postABook,
  getAllBooks,
  getBooksByCategory,
  getSingleBook,
  UpdateBook,
  deleteABook,
} = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');

router.post("/create-book", verifyAdminToken, postABook);

router.get("/", getAllBooks);
router.get("/category/:category", getBooksByCategory);
router.get("/:id", getSingleBook);

router.put("/edit/:id", verifyAdminToken, UpdateBook);
router.delete("/delete/:id", verifyAdminToken, deleteABook);

module.exports = router;

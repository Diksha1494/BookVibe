const express = require('express');
const router = express.Router();
const {
  postABook,
  getAllBooks,
  getBooksByCategory,
  getSingleBook,
  UpdateBook,
  deleteABook,
  createMarketplaceListing,
  getMyListings,
  deleteMyListing,
} = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const verifyToken = require('../middleware/verifyToken');

router.post("/create-book", verifyAdminToken, postABook);
router.post("/marketplace", verifyToken, createMarketplaceListing);

router.get("/", getAllBooks);
router.get("/marketplace/my-listings", verifyToken, getMyListings);
router.delete("/marketplace/:id", verifyToken, deleteMyListing);
router.get("/category/:category", getBooksByCategory);
router.get("/:id", getSingleBook);

router.put("/edit/:id", verifyAdminToken, UpdateBook);
router.delete("/delete/:id", verifyAdminToken, deleteABook);

module.exports = router;

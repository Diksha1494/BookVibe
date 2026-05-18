const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const {
  createBorrowRequest,
  getMyBorrowRequests,
  getIncomingBorrowRequests,
  updateBorrowStatus,
} = require("./borrow.controller");

const router = express.Router();

router.post("/:bookId", verifyToken, createBorrowRequest);
router.get("/my-requests", verifyToken, getMyBorrowRequests);
router.get("/incoming", verifyToken, getIncomingBorrowRequests);
router.patch("/:requestId/status", verifyToken, updateBorrowStatus);

module.exports = router;

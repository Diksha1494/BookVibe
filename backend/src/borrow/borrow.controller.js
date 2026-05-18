const mongoose = require("mongoose");
const Book = require("../books/book.model");
const BorrowRequest = require("./borrow.model");

const populateBorrow = (query) =>
  query
    .populate("book", "title coverImage availabilityStatus listingMode ownerName")
    .populate("borrower", "username email")
    .populate("owner", "username email");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const createBorrowRequest = async (req, res) => {
  try {
    const { bookId } = req.params;
    const borrowerId = req.user?.id;

    if (!isValidId(bookId)) {
      return res.status(400).json({ message: "Invalid book id." });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    if (!book.owner) {
      return res.status(400).json({ message: "This book is not managed by a marketplace owner." });
    }

    if (String(book.owner) === String(borrowerId)) {
      return res.status(403).json({ message: "You cannot borrow your own book." });
    }

    if (!book.borrowEnabled && book.listingMode !== "borrow") {
      return res.status(400).json({ message: "Borrowing is not enabled for this book." });
    }

    if (book.availabilityStatus !== "available") {
      return res.status(409).json({ message: "This book is no longer available." });
    }

    const request = await BorrowRequest.create({
      book: book._id,
      borrower: borrowerId,
      owner: book.owner,
      status: "pending",
    });

    const populatedRequest = await populateBorrow(BorrowRequest.findById(request._id));
    return res.status(201).json({ message: "Borrow request created.", request: populatedRequest });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "You already have a pending request for this book." });
    }
    console.error("Create borrow request error:", error);
    return res.status(500).json({ message: "Failed to create borrow request." });
  }
};

const getMyBorrowRequests = async (req, res) => {
  try {
    const requests = await populateBorrow(
      BorrowRequest.find({ borrower: req.user.id }).sort({ createdAt: -1 })
    );
    return res.json({ requests });
  } catch (error) {
    console.error("Get my borrow requests error:", error);
    return res.status(500).json({ message: "Failed to fetch borrow requests." });
  }
};

const getIncomingBorrowRequests = async (req, res) => {
  try {
    const requests = await populateBorrow(
      BorrowRequest.find({ owner: req.user.id }).sort({ createdAt: -1 })
    );
    return res.json({ requests });
  } catch (error) {
    console.error("Get incoming borrow requests error:", error);
    return res.status(500).json({ message: "Failed to fetch incoming borrow requests." });
  }
};

const updateBorrowStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!isValidId(requestId)) {
      return res.status(400).json({ message: "Invalid request id." });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected." });
    }

    const request = await BorrowRequest.findOne({
      _id: requestId,
      owner: req.user.id,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ message: "Pending request not found." });
    }

    if (status === "approved") {
      const book = await Book.findOneAndUpdate(
        { _id: request.book, owner: req.user.id, availabilityStatus: "available" },
        { $set: { availabilityStatus: "borrowed" } },
        { new: true }
      );

      if (!book) {
        return res.status(409).json({ message: "This book is already unavailable." });
      }

      request.status = "approved";
      await request.save();

      await BorrowRequest.updateMany(
        { _id: { $ne: request._id }, book: request.book, status: "pending" },
        { $set: { status: "rejected" } }
      );
    } else {
      request.status = "rejected";
      await request.save();
    }

    const populatedRequest = await populateBorrow(BorrowRequest.findById(request._id));
    return res.json({ message: `Borrow request ${status}.`, request: populatedRequest });
  } catch (error) {
    console.error("Update borrow status error:", error);
    return res.status(500).json({ message: "Failed to update borrow request." });
  }
};

module.exports = {
  createBorrowRequest,
  getMyBorrowRequests,
  getIncomingBorrowRequests,
  updateBorrowStatus,
};

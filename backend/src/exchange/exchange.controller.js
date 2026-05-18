const mongoose = require("mongoose");
const Book = require("../books/book.model");
const ExchangeRequest = require("./exchange.model");

const populateExchange = (query) =>
  query
    .populate("requestedBook", "title coverImage availabilityStatus listingMode ownerName")
    .populate("offeredBook", "title coverImage availabilityStatus listingMode ownerName")
    .populate("requester", "username email")
    .populate("owner", "username email");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const createExchangeRequest = async (req, res) => {
  try {
    const { requestedBookId, offeredBookId } = req.body;
    const requesterId = req.user?.id;

    if (!isValidId(requestedBookId) || !isValidId(offeredBookId)) {
      return res.status(400).json({ message: "Requested and offered book ids are required." });
    }

    if (String(requestedBookId) === String(offeredBookId)) {
      return res.status(400).json({ message: "Choose a different book to offer." });
    }

    const [requestedBook, offeredBook] = await Promise.all([
      Book.findById(requestedBookId),
      Book.findById(offeredBookId),
    ]);

    if (!requestedBook || !offeredBook) {
      return res.status(404).json({ message: "One of the selected books was not found." });
    }

    if (!requestedBook.owner) {
      return res.status(400).json({ message: "Requested book is not owned by a marketplace user." });
    }

    if (String(requestedBook.owner) === String(requesterId)) {
      return res.status(403).json({ message: "You cannot exchange for your own book." });
    }

    if (String(offeredBook.owner) !== String(requesterId)) {
      return res.status(403).json({ message: "You can only offer one of your own books." });
    }

    if (!requestedBook.exchangeEnabled && requestedBook.listingMode !== "exchange") {
      return res.status(400).json({ message: "Exchange is not enabled for this book." });
    }

    if (requestedBook.availabilityStatus !== "available" || offeredBook.availabilityStatus !== "available") {
      return res.status(409).json({ message: "One of these books is no longer available." });
    }

    const request = await ExchangeRequest.create({
      requestedBook: requestedBook._id,
      offeredBook: offeredBook._id,
      requester: requesterId,
      owner: requestedBook.owner,
      status: "pending",
    });

    const populatedRequest = await populateExchange(ExchangeRequest.findById(request._id));
    return res.status(201).json({ message: "Exchange request created.", request: populatedRequest });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "You already have a pending exchange request for these books." });
    }
    console.error("Create exchange request error:", error);
    return res.status(500).json({ message: "Failed to create exchange request." });
  }
};

const getMyExchangeRequests = async (req, res) => {
  try {
    const requests = await populateExchange(
      ExchangeRequest.find({ requester: req.user.id }).sort({ createdAt: -1 })
    );
    return res.json({ requests });
  } catch (error) {
    console.error("Get my exchange requests error:", error);
    return res.status(500).json({ message: "Failed to fetch exchange requests." });
  }
};

const getIncomingExchangeRequests = async (req, res) => {
  try {
    const requests = await populateExchange(
      ExchangeRequest.find({ owner: req.user.id }).sort({ createdAt: -1 })
    );
    return res.json({ requests });
  } catch (error) {
    console.error("Get incoming exchange requests error:", error);
    return res.status(500).json({ message: "Failed to fetch incoming exchange requests." });
  }
};

const updateExchangeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid request id." });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected." });
    }

    const request = await ExchangeRequest.findOne({
      _id: id,
      owner: req.user.id,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ message: "Pending request not found." });
    }

    if (status === "approved") {
      const requestedBook = await Book.findOneAndUpdate(
        { _id: request.requestedBook, owner: req.user.id, availabilityStatus: "available" },
        { $set: { availabilityStatus: "exchanged" } },
        { new: true }
      );

      if (!requestedBook) {
        return res.status(409).json({ message: "Requested book is already unavailable." });
      }

      const offeredBook = await Book.findOneAndUpdate(
        { _id: request.offeredBook, owner: request.requester, availabilityStatus: "available" },
        { $set: { availabilityStatus: "exchanged" } }
      );

      if (!offeredBook) {
        await Book.findOneAndUpdate(
          { _id: request.requestedBook, owner: req.user.id, availabilityStatus: "exchanged" },
          { $set: { availabilityStatus: "available" } }
        );
        return res.status(409).json({ message: "Offered book is already unavailable." });
      }

      request.status = "approved";
      await request.save();

      await ExchangeRequest.updateMany(
        { _id: { $ne: request._id }, requestedBook: request.requestedBook, status: "pending" },
        { $set: { status: "rejected" } }
      );
    } else {
      request.status = "rejected";
      await request.save();
    }

    const populatedRequest = await populateExchange(ExchangeRequest.findById(request._id));
    return res.json({ message: `Exchange request ${status}.`, request: populatedRequest });
  } catch (error) {
    console.error("Update exchange status error:", error);
    return res.status(500).json({ message: "Failed to update exchange request." });
  }
};

module.exports = {
  createExchangeRequest,
  getMyExchangeRequests,
  getIncomingExchangeRequests,
  updateExchangeStatus,
};

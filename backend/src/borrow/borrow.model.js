const mongoose = require("mongoose");

const borrowRequestSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

borrowRequestSchema.index(
  { book: 1, borrower: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } }
);
borrowRequestSchema.index({ borrower: 1, createdAt: -1 });
borrowRequestSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model("BorrowRequest", borrowRequestSchema);

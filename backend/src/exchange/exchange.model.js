const mongoose = require("mongoose");

const exchangeRequestSchema = new mongoose.Schema(
  {
    requestedBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    offeredBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    requester: {
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

exchangeRequestSchema.index(
  { requestedBook: 1, offeredBook: 1, requester: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } }
);
exchangeRequestSchema.index({ requester: 1, createdAt: -1 });
exchangeRequestSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model("ExchangeRequest", exchangeRequestSchema);

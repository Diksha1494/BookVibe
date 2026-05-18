const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const {
  createExchangeRequest,
  getMyExchangeRequests,
  getIncomingExchangeRequests,
  updateExchangeStatus,
} = require("./exchange.controller");

const router = express.Router();

router.post("/", verifyToken, createExchangeRequest);
router.get("/my-requests", verifyToken, getMyExchangeRequests);
router.get("/incoming", verifyToken, getIncomingExchangeRequests);
router.patch("/:id/status", verifyToken, updateExchangeStatus);

module.exports = router;

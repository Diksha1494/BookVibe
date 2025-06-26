const express = require('express');
const { createAOrder, getOrderByEmail } = require('./order.controller');
const router = express.Router();


//create orders endpoint
router.post("/",createAOrder);
//get order by user
router.get("/email/:email",getOrderByEmail);


module.exports = router;
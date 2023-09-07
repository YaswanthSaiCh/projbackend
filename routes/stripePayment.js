const express = require("express");

const { makeStripePayment } = require("../controllers/stripePayment");
const router = express.Router();

router.post("/stripe-checkout", makeStripePayment);
module.exports = router;

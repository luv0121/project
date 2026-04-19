const express = require("express");
const router = express.Router();

const wrapasync = require("../utils/wrapasync");
const paymentsController = require("../controller/payments");
const { isloggedin, isBookingOwner } = require("../middleware");

// show mock payment page
router.get(
    "/mock/:bookingId",
    isloggedin,
    isBookingOwner,
    wrapasync(paymentsController.showMockPaymentPage)
);

// success
router.post(
    "/mock/:bookingId/success",
    isloggedin,
    isBookingOwner,
    wrapasync(paymentsController.mockPaymentSuccess)
);

// failure
router.post(
    "/mock/:bookingId/failure",
    isloggedin,
    isBookingOwner,
    wrapasync(paymentsController.mockPaymentFailure)
);

// cancel
router.post(
    "/mock/:bookingId/cancel",
    isloggedin,
    isBookingOwner,
    wrapasync(paymentsController.mockPaymentCancel)
);

module.exports = router;
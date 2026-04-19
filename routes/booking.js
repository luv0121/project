const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapasync = require("../utils/wrapasync");
const { isloggedin, validateBooking, isNotListingOwnerBooking,  isBookingOwner} = require("../middleware");
const bookingController = require("../controller/bookings");

router.post(
  "/",
  isloggedin,
   isNotListingOwnerBooking,
  validateBooking,
  wrapasync(bookingController.createPendingBooking)
);

router.get(
  "/my",
  isloggedin,
  wrapasync(bookingController.myBookings)
);

router.get(
  "/:bookingId",
  isloggedin,
   isBookingOwner,
  wrapasync(bookingController.showBooking)
);

router.post(
  "/:bookingId/cancel",
  isloggedin,
  isBookingOwner,
  wrapasync(bookingController.cancelBooking)
);

module.exports = router;
const Booking = require("../models/booking");

function calculateNights(checkIn, checkOut) {
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function calculateBookingAmount(listing, nights) {
  const nightlyPrice = listing.price;
  const cleaningFee = listing.cleaningFee || 0;
  const serviceFee = listing.serviceFee || 0;
  const totalPrice = nightlyPrice * nights + cleaningFee + serviceFee;

  return {
    nightlyPrice,
    cleaningFee,
    serviceFee,
    totalPrice
  };
}

async function hasDateConflict(listingId, checkIn, checkOut) {
  const conflict = await Booking.findOne({
    listing: listingId,
    bookingStatus: { $in: ["pending", "confirmed"] },
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) }
  });

  return !!conflict;
}

module.exports = {
  calculateNights,
  calculateBookingAmount,
  hasDateConflict
};
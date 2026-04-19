const Listing = require("../models/listing");
const Booking = require("../models/booking");
const ExpressError = require("../utils/expressError");
const {
  calculateNights,
  calculateBookingAmount,
  hasDateConflict
} = require("../utils/booking");

// create a pending booking
module.exports.createPendingBooking = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id).populate("owner");
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  if (listing.owner.equals(req.user._id)) {
    req.flash("error", "You cannot book your own listing");
    return res.redirect(`/listings/${id}`);
  }

  const { checkIn, checkOut, guests, specialRequests } = req.body.booking;

  const nights = calculateNights(checkIn, checkOut);
  if (nights < 1) {
    req.flash("error", "Invalid booking dates");
    return res.redirect(`/listings/${id}`);
  }

  if (guests > (listing.maxGuests || 2)) {
    req.flash("error", "Guest count exceeds listing capacity");
    return res.redirect(`/listings/${id}`);
  }

  const conflict = await hasDateConflict(id, checkIn, checkOut);
  if (conflict) {
    req.flash("error", "Selected dates are not available");
    return res.redirect(`/listings/${id}`);
  }

  const amount = calculateBookingAmount(listing, nights);

  const booking = new Booking({
    listing: listing._id,
    user: req.user._id,
    owner: listing.owner._id,
    checkIn,
    checkOut,
    guests,
    nights,
    nightlyPrice: amount.nightlyPrice,
    cleaningFee: amount.cleaningFee,
    serviceFee: amount.serviceFee,
    totalPrice: amount.totalPrice,
    specialRequests,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000)
  });

  await booking.save();

  req.flash("success", "Booking created successfully");
  res.redirect(`/listings/${id}/bookings/${booking._id}`);
};

// show all bookings of current user
module.exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });

  res.render("bookings/index.ejs", { bookings });
};

// show one booking
module.exports.showBooking = async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId)
    .populate("listing")
    .populate("user")
    .populate("owner");

  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/listings");
  }

  res.render("bookings/show.ejs", { booking });
};

// cancel booking
module.exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/listings");
  }

  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You are not authorized to cancel this booking");
    return res.redirect("/listings");
  }

  if (booking.bookingStatus === "confirmed") {
    booking.bookingStatus = "cancelled";
    await booking.save();
  } else if (booking.bookingStatus === "pending") {
    booking.bookingStatus = "cancelled";
    await booking.save();
  } else {
    req.flash("error", "This booking cannot be cancelled");
    return res.redirect(`/listings/${booking.listing}/bookings/${booking._id}`);
  }

  req.flash("success", "Booking cancelled successfully");
  res.redirect("/listings");
};
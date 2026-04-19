const Booking = require("../models/booking");
const ExpressError = require("../utils/expressError");

// show mock payment page
module.exports.showMockPaymentPage = async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("listing");

    if (!booking) {
        throw new ExpressError(404, "Booking not found");
    }

    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "You are not authorized to access this booking");
        return res.redirect("/listings");
    }

    res.render("bookings/checkout.ejs", { booking });
};

// simulate successful payment
module.exports.mockPaymentSuccess = async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ExpressError(404, "Booking not found");
    }

    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "Unauthorized access");
        return res.redirect("/listings");
    }

    booking.paymentStatus = "paid";
    booking.bookingStatus = "confirmed";
    booking.paymentProvider = "mock";
    booking.providerPaymentId = "MOCKPAY_" + Date.now();

    await booking.save();

    req.flash("success", "Mock payment successful. Booking confirmed.");
    res.redirect(`/listings/${booking.listing}/bookings/${booking._id}`);
};

// simulate failed payment
module.exports.mockPaymentFailure = async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ExpressError(404, "Booking not found");
    }

    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "Unauthorized access");
        return res.redirect("/listings");
    }

    booking.paymentStatus = "failed";
    booking.bookingStatus = "failed";
    booking.paymentProvider = "mock";

    await booking.save();

    req.flash("error", "Mock payment failed.");
    res.redirect(`/listings/${booking.listing}/bookings/${booking._id}`);
};

// simulate cancelled payment
module.exports.mockPaymentCancel = async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ExpressError(404, "Booking not found");
    }

    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "Unauthorized access");
        return res.redirect("/listings");
    }

    booking.paymentStatus = "pending";
    booking.bookingStatus = "pending";

    await booking.save();

    req.flash("error", "Payment was cancelled.");
    res.redirect(`/listings/${booking.listing}/bookings/${booking._id}`);
};
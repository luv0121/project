const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    checkIn: {
      type: Date,
      required: true
    },
    checkOut: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.checkIn;
        },
        message: "Check-out must be after check-in"
      }
    },

    guests: {
      type: Number,
      required: true,
      min: 1
    },

    nights: {
      type: Number,
      required: true,
      min: 1
    },

    nightlyPrice: {
      type: Number,
      required: true
    },
    cleaningFee: {
      type: Number,
      default: 0
    },
    serviceFee: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "failed", "expired"],
      default: "pending"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },

    paymentProvider: {
      type: String,
      enum: ["razorpay", "stripe"],
      default: "razorpay"
    },

    providerOrderId: String,
    providerPaymentId: String,
    providerSignature: String,
    webhookEventId: String,

    expiresAt: {
      type: Date
    },

    statusReason: {
      type: String,
      default: ""
    },

    specialRequests: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Indexes
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ providerOrderId: 1 }, { unique: true, sparse: true });
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Booking", bookingSchema);
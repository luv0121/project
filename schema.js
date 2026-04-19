const joi=require("joi");

module.exports.listingschema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        category: joi.string().valid(
            "Trending",
            "Rooms",
            "Iconic Cities",
            "Mountains",
            "Castles",
            "Amazing Pools",
            "Camping",
            "Farms",
            "Arctic"
        ).required(),
        image: joi.object({
            url: joi.string().uri().allow("", null)
        }).optional(),
        price: joi.number().required().min(0)
    }).required()
});


module.exports.reviewschema=joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required()
    }).required(),
});

module.exports.bookingschema = joi.object({
  booking: joi.object({
    checkIn: joi.date().required(),
    checkOut: joi.date().greater(joi.ref("checkIn")).required(),
    guests: joi.number().integer().min(1).required(),
    specialRequests: joi.string().allow("").max(500)
  }).required()
});
const joi=require("joi");

module.exports.listingschema=joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        image: joi.object({url: joi.string().uri().allow("", null)}),
        price:joi.number().required().min(0)
    }).required()
});


module.exports.reviewschema=joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required()
    }).required(),
});
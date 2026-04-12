require("dotenv").config();
const mongoose = require("mongoose");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const Listing = require("../models/listing");

const mapToken = process.env.MAP_TOKEN;
console.log("map token:",mapToken);
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// connect DB
mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
.then(() => console.log("DB connected"))
.catch(err => console.log(err));

async function updateListings() {
 const listings = await Listing.find({
  "geometry.coordinates.0": { $gte: 77, $lte: 78 },
  "geometry.coordinates.1": { $gte: 28, $lte: 29 }
});
  console.log(`Found ${listings.length} listings to update`);
  console.log("DB NAME:", mongoose.connection.name);

  for (let listing of listings) {
    try {
      let response = await geocodingClient
        .forwardGeocode({
          query: listing.location,
          limit: 1
        })
        .send();

      let coords = response.body.features[0].geometry.coordinates;

      listing.geometry = {
        type: "Point",
        coordinates: coords
      };

      await listing.save();

      console.log(`Updated: ${listing.title}`);
    } catch (err) {
      console.log(`Error updating ${listing.title}`, err.message);
    }
  }

  console.log("Done updating all listings");
  mongoose.connection.close();
}

updateListings();
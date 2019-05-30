var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listingSchema = new Schema({
    id: {type: Number},
    name: {type: String},
    picture_url: {type: String},
    host_name: {type: String},
    smart_location: {type: String},
    price: {type: String},
    bedrooms: {type: Number},
    property_type: {type: String},
    review_scores_rating: {type: Number},
    extra_people: {type: Number},
    has_availability: {type: String},
    availability_30: {type: Number},
    availability_60: {type: Number},
    availability_90: {type: Number},
    availability_365: {type: Number}
});

module.exports = mongoose.model('Listing', listingSchema);
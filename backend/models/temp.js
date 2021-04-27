const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tempSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: Number, required: true },
    zip4: { type: Number, required: true }

});


module.exports = mongoose.model('Temp', tempSchema);
const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const tempbookSchema = new Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: Number, required: true },
    category: { type: String, required: true },
    publisher: { type: String, required: true },
});
// bookSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Tempbook', tempbookSchema);
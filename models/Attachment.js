const { Schema, model } = require("mongoose");

const schema = new Schema({
    name: String,
    type: {type: String, required: true},
    link: String
})

module.exports = model("Attachment", schema)
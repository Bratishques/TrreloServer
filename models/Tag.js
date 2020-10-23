const { Schema, model } = require("mongoose");

const schema = new Schema({
    name: String,
    color: String,
})

module.exports = model("Tag", schema)
const { Schema, model } = require("mongoose");

const schema = Schema({
    name: String,
    posts: [{type: Schema.Types.ObjectId, ref: "Post"}],

}, { timestamps: true })

module.exports = model("Thread", schema)
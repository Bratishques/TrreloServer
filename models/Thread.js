const { Schema, model } = require("mongoose");

const schema = Schema({
    name: String,
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
    posts: [{type: Schema.Types.ObjectId, ref: "Post"}],

}, { timestamps: true })

module.exports = model("Thread", schema)
const { Schema, model } = require("mongoose");

const schema = Schema({
    name: String,
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
    status: String,
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]

})

module.exports = model("Thread", schema)
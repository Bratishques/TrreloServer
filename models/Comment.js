const { Schema, model } = require("mongoose");

const schema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    text: String,
    replies: [{type: Schema.Types.ObjectId, ref: "Comment"}]
})

module.exports = model("Comment", schema)
const { Schema, model } = require("mongoose");

const schema = new Schema({
    name: String,
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    status: String,
    attachments: [{type: Schema.Types.ObjectId, ref: "Attachment"}],
})

module.exports = model("Post", schema)
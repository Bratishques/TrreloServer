const { Schema, model } = require("mongoose");

const schema = new Schema ({
    name: String,
    threads: [{type: Schema.Types.ObjectId, ref: "Thread"}],
    tags: [{type: Schema.Types.ObjectId, ref: "Tag"}]
})

module.exports = model("Board", schema)
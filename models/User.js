const {model, Schema} = require('mongoose')

const schema = new Schema ({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    boards: [{type: Schema.Types.ObjectId, ref: "Board"}]
})

module.exports = model("User", schema)
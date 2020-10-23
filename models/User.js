const {model, Schema} = require('mongoose')

const schema = new Schema ({
    name: {type: String, required},
    email: {type: String, required},
    password: {type: String, required},
    boards: [{type: Schema.Types.ObjectId, ref: "Board"}]
})

module.exports = model("User", schema)
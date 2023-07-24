const {Schema, model, ObjectId} = require("mongoose")

const User = new Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    freeSpace: {type: Number, default: 1024**3*10},
    usedSpace: {type: Number, default: 0},
    // avatar: {type: String},
    files: [{type: ObjectId, ref:'File'}]
})

module.exports = model('User', User)
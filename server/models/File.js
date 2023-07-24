const {Schema, model, ObjectId} = require("mongoose")

const File = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    extension: {type: String, default: ""},
    date: {type: Date, default: Date.now()},
    size: {type: Number, default: 0},
    path: {type: String, default: ""},
    access_link: {type: String},
    user: {type: ObjectId, ref: 'User'},
    parent: {type: ObjectId, ref:'File'},
    child: [{type: ObjectId, ref:'File'}]
})

module.exports = model('File', File)
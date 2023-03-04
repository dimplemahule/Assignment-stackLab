
const mongoose = require('mongoose')

const userDetailsSchema = new mongoose.Schema({ //for the creatting purpose
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    phoneNo: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: String,
        unique: true,
        required: true
    },
    userType: String
}, {
    collection: "UserInfo"
})
mongoose.model("UserInfo", userDetailsSchema)

//  A Mongoose model is a wrapper on the Mongoose schema.
//  A Mongoose schema defines the structure of the document,
//  default values, validators, etc.,
//  whereas a Mongoose model provides an interface
//  to the database for creating, querying, updating, deleting records, etc.
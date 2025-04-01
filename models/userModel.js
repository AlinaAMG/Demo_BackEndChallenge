const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        maxlength:10,
    },
    lastName: {
        type: String,
        required: true,
        maxlength:15,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,

    },
    password: {
        type: String,
        required:true,
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("User", userSchema);

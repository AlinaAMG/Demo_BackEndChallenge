const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength:25,
    },
    article:{
        type: String,
        required: true,
        minlength:100,
    },
    date: {
        type: Date,
        default: Date.now,
      },
})
module.exports = mongoose.model("Article", articleSchema);
const mongoose = require('mongoose')

var roomSchema = mongoose.Schema( {
    roomNo : {
        type : Number,
        required : true
    },
    reserved: [
        {
            from: Date,
            to: Date
        }
    ],
    rate :{
        type : Number,
        required: true
    }
});

module.exports = roomSchema;
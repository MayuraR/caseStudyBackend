const mongoose = require('mongoose')

var roomReservationSchema = mongoose.Schema( {
    membershipId : {
        type : mongoose.Types.ObjectId,
        required : true
    },
    noOfChildren : {
        type : Number,
        required : true
    },
    noOfAdults : {
        type : Number,
        required : true
    },
    checkInDate : {
        type : Date,
        required : true
    },
    checkOutDate : {
        type : Date,
        required : true
    },
    roomNo : {
        type : Number,
        required : true
    },
    verificationDoc: {
        type : String,
        required : true
    },
    additionalRequirements : {
        type : String
    }
});

module.exports = roomReservationSchema ;
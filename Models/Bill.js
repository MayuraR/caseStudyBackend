const mongoose = require('mongoose')

var billSchema = mongoose.Schema( {
    memberId : {
        type : mongoose.Types.ObjectId,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    gst : {
        type : Number,
        required : true
    },
    grandTotal : {
        type : Number,
        required : true
    }
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
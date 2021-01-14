const mongoose = require('mongoose')

var staffSchema = mongoose.Schema( {
    name : {
        type : String,
        required : true
    },
    department : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    contact : {
        type : Number,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    verificationDoc : {
        type : String,
        required : true
    },
    salary : {
        type : Number,
        required : true
    }
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
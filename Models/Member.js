const mongoose = require('mongoose')

var memberSchema = mongoose.Schema( {
    name : {
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
    }
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
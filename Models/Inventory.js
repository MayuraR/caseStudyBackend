const mongoose = require('mongoose')

var inventorySchema = mongoose.Schema( {
    date : {
        type : Date,
        required : true
    },
    area : {
        type : String,
        required : true
    },
    item : {
        type : String,
        required : true
    },
    quantity: {
        type : String,
        required : true
    }
});

const inventory = mongoose.model('inventory', inventorySchema);

module.exports = inventory;
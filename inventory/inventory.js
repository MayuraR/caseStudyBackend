var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors')
var { requireAuth } = require('../middleware/authentication')
var { authRole } = require('../middleware/authorization')


app = express();
app.use(express.json())
app.use(cors());

mongoose.Promise = global.Promise;

// connect to the database
mongoose.connect('mongodb+srv://test:test@cluster0.tfqi1.mongodb.net/inventory',{ useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false })
    .then(console.log('Connected to database "inventory"'))
    .catch((err) => {console.log(err)})

const Inventory = require('../Models/Inventory')

//methods: ADD, GET, UPDATE, DELETE


//Get inventory by item
app.get('/inventory/:item',requireAuth, (req, res) =>{
    Inventory.find({ item : req.params.item})
        .then((inventory) => res.send(inventory))
        .catch((err) => res.json(err))
})


//add an inventory (POST)
app.post('/inventory',requireAuth, authRole(['Manager','Owner']),(req, res) =>{
    (new Inventory ( { 'date' : req.body.date, 'area' : req.body.area, 'item' : req.body.item, 'quantity' : req.body.quantity}))
        .save()
        .then((inventory) => res.send(inventory))
        .catch((err) => res.json(err))
})

//update an inventory (PATCH)
app.patch('/inventory/:id',requireAuth, authRole(['Manager','Owner']), (req, res) =>{
    Inventory.findOneAndUpdate({ _id : req.params.id}, { $set : req.body })
        .then((inventory) => {
            console.log("Inventory updated!")
            Inventory.find({ _id : req.params.id})
                .then((reservation) => res.send(reservation))
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
    
})

//deleting an inventory
app.delete('/inventory/:id',requireAuth, authRole(['Manager','Owner']), (req, res) =>{
    Inventory.findOneAndDelete({  _id : req.params.id })
        .then((reservation) => res.send("inventory deleted"))
        .catch((err) => console.log(err))
})

const server = app.listen(3600, () => {
    console.log('Listening to port 3600')
})

module.exports = server
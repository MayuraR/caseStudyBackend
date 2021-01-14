var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var { requireAuth } = require('../middleware/authentication');
var { authRole } = require('../middleware/authorization');
var { sendMail } = require('../mail/sendMail')

app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser())

mongoose.Promise = global.Promise;

// connect to the database
mongoose.connect('mongodb+srv://test:test@cluster0.tfqi1.mongodb.net/members',{ useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false })
    .then(console.log('Connected to database "members"'))
    .catch((err) => {console.log(err)})

app.use(express.json())

const Member = require('../Models/Member')

//methods: ADD, GET, UPDATE

//Get all members
app.get('/members', requireAuth, authRole(['Manager','Owner','Receptionist']), (req, res) =>{
    Member.find({})
        .then((member) => res.send(member))
        .catch((err) => console.log(err))
})

//Get member by id
app.get('/members/:id', authRole([]),(req, res) =>{
    Member.find({ _id : req.params.id})
        .then((member) => res.send(member))
        .catch((err) => res.json(err))
})

//add a member(POST)
app.post('/members',  (req, res) =>{
    (new Member ( { 'name' : req.body.name, 'gender' : req.body.gender, 'contact' : req.body.contact, 'email' : req.body.email}))
        .save()
        .then((member) => {
            sendMail(member, info => {
                console.log(`The mail has been sent and the id is ${info.messageId}`);
                console.log(info);
              })
            res.send(member)
        })
        .catch((err) => console.log(err))
})

//update (PATCH)
app.patch('/members/:id',requireAuth, authRole(['Manager','Owner','Receptionist']),(req, res) =>{
    Member.findOneAndUpdate({ _id : req.params.id}, { $set : req.body })
        .then((member) => {
            console.log('member updated');
            Member.find({ _id : req.params.id})
                .then((member) => res.send(member))
                .catch((err) => console.log(err))})
        .catch((err) => console.log(err))
    
})

const server = app.listen(3000, () => {
    console.log('Listening to port 3000')
})

module.exports = server
var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var { requireAuth } = require('../middleware/authentication')
var { authRole } = require('../middleware/authorization')

app = express();
app.use(express.json());
app.use(cors()); 

mongoose.Promise = global.Promise;

// connect to the database
mongoose.connect('mongodb+srv://test:test@cluster0.tfqi1.mongodb.net/staff',{ useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false })
    .then(console.log('Connected to database "staff"'))
    .catch((err) => {console.log(err)})

app.use(express.json())

const Staff = require('../Models/Staff')

//methods: ADD, GET, UPDATE, DELETE

//Get staff members by department
//http://localhost:3700/staff?department=kitchen
app.get('/staff', requireAuth, authRole(['Manager','Owner']), (req, res) =>{
    const matchItem = req.query.department
    Staff.find({ department : matchItem})
        .then((staff) => res.send(staff))
        .catch((err) => res.send(err))
})

app.get('/allStaff', requireAuth, authRole(['Manager','Owner']),(req, res) =>{
    Staff.find({})
      .then((members) => res.send(members))
      .catch((err) => res.send(err))
})

//Get member by id
app.get('/staff/:id', requireAuth, authRole(['Manager','Owner']),  (req, res) =>{
    Staff.find({ _id : req.params.id})
        .then((staff) => res.send(staff))
        .catch((err) => res.send(err))
})

// //get salary of all members in a department
// app.get('/salary/:department',  requireAuth, (req, res) => {
//     Staff.find({ department : req.params.department }).select(["name", "salary"])
//         .then((staff) => res.send(staff))
//         .catch((err) => console.log(err))
// })

// //get total salary given for all members in a department
// app.get('/departmentSalary/:department', requireAuth, (req, res) => {
//     sum = 0
//     Staff.find({ department : req.params.department })
//     .then((members) => {
//         members.forEach(element =>{
//             sum+=element.salary
//         })
//         res.send(`The sum for salary of all members in department ${req.params.department} is ${sum}`)
//     })
// })

//add a member(POST)
app.post('/staff',requireAuth, authRole(['Manager','Owner']), (req, res) =>{
    (new Staff ( { 'name' : req.body.name, 
                    'department' : req.body.department, 
                    'gender' : req.body.gender, 
                    'contact' : req.body.contact, 
                    'email' : req.body.email, 
                    'verificationDoc' : req.body.verificationDoc, 
                    'salary' : req.body.salary
                }))
        .save()
        .then((staff) => res.send(staff))
        .catch((err) => res.send(err))
})

//update (PATCH)
app.patch('/staff/:id', requireAuth,  authRole(['Manager','Owner']), (req, res) =>{
    Staff.findOneAndUpdate({ _id : req.params.id}, { $set : req.body })
        .then((staff) => {
            console.log('staff updated');
            Staff.find({ _id : req.params.id})
                .then((staff) => res.send(staff))
                .catch((err) => console.log(err))})
        .catch((err) => console.log(err))
    
})

//deleting a member
app.delete('/staff/:id', requireAuth, authRole(['Manager','Owner']),(req, res) =>{
    Staff.findOneAndDelete({  _id : req.params.id })
        .then((staff) => res.send("staff member deleted"))
        .catch((err) => console.log(err))
})

const server = app.listen(3700, () => {
    console.log('Listening to port 3700')
})

module.exports = server
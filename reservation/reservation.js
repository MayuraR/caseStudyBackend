var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var axios = require('axios');
var { requireAuth } = require('../middleware/authentication');
var { authRole } = require('../middleware/authorization');
var { reservationMail } = require('../mail/reservationMail');

app = express();
app.use(express.json());
app.use(cors());


mongoose.Promise = global.Promise;

const roomReservationSchema = require('../Models/Room-reservation');
const roomSchema = require('../Models/Room');

// connect to the database
var r = mongoose.createConnection('mongodb+srv://test:test@cluster0.tfqi1.mongodb.net/room', { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false })
var roomReservation = mongoose.createConnection('mongodb+srv://test:test@cluster0.tfqi1.mongodb.net/room-reservation', { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false })


var roomReservation  = roomReservation.model('roomReservation', roomReservationSchema);
var room = r.model('room', roomSchema);


//ROOM RESERVATION
//methods: ADD, GET, UPDATE, DELETE

//Get all reservation
app.get('/room', requireAuth, (req, res) =>{
    roomReservation.find({})
        .then((member) => res.send(member))
        .catch((err) => console.log(err))  
})

//Get reservation by id
app.get('/room/:id', requireAuth, authRole([]), (req, res) =>{
    roomReservation.find({ _id : req.params.id})
        .then((reservation) => res.send(reservation))
        .catch((err) => console.log(err))
})

//find room available
//http://localhost:3500/available?start=2020-12-09&&end=2020-12-11
app.get('/available',   (req, res) =>{
    const matchStart = new Date(req.query.start)
    const matchEnd = new Date(req.query.end)
    available = [] 
    room.find({})
    .then( (rooms) => {
        rooms.forEach(element =>{
            flag = false;
            array = element.reserved
            
            for(i=0; i<array.length; i++){
                
                if((matchStart>= array[i].from && matchStart<=array[i].to) || (matchEnd>=array[i].from && matchEnd<=array[i].to)){
                    flag = false
                    break
                }
                else if(matchStart>array[i].to || matchEnd< array[i].from){
                    flag = true
                }
                
            }
            if(flag){
                available.push(element.roomNo)
            }
        })
        res.send(available)
    }    )
    .catch((err) => res.send(err))
    
   
})

//add a reservation(POST)
app.post('/room', (req, res) =>{
    (new roomReservation ( {
        "membershipId" : req.body.membershipId, 
        "noOfChildren" : req.body.noOfChildren,
        "noOfAdults" : req.body.noOfAdults,             
        "checkInDate" : req.body.checkInDate,
        "checkOutDate" : req.body.checkOutDate,
        "roomNo" : req.body.roomNo,
        "verificationDoc" : req.body.verificationDoc,
        "additionalRequirements" : req.body.additionalRequirements
}))
        .save()
        .then((reservation) => {

            axios.get("http://localhost:3000/members/"+reservation.membershipId)
                .then(response =>{
                    console.log(response.data[0]);
                    reservationMail(reservation, response.data[0], info => {
                        console.log(`The mail has been sent and the id is ${info.messageId}`);
                        //console.log(info);
                      }) 
                })
                .catch(err => res.send(err.message))
            //console.log("Within reservation")
            res.send("Reservation added! Check mails")
        })
        .catch((err) => res.send(err.message))

        //add to the room database
        room.findOneAndUpdate( {"roomNo" : req.body.roomNo}, {
            $push: {"reserved": {from: new Date(req.body.checkInDate), to: new Date (req.body.checkOutDate)}}
        })
            .then(console.log("done"))
            .catch((err) => console.log(err))
        })

//update (PATCH)
app.patch('/room/:id',requireAuth, (req, res) => {
    let oldCheckIn; 
    let index
    roomReservation.findOneAndUpdate( {_id : req.params.id}, req.body)
        .then((reservation) => {
            oldCheckIn = new Date(reservation.checkInDate)
            console.log('reservation updated');
            roomReservation.find({ _id : req.params.id})
                .then((reservation) => {
                    room.findOne({"roomNo" : req.body.roomNo})
                    .then( (rooms) => {                    
                        let array = rooms.reserved
                        
                        for(let i =0; i<array.length; i++){
                            if(array[i].from.valueOf() === oldCheckIn.valueOf()){
                                array[i].from = req.body.checkInDate
                                array[i].to = req.body.checkOutDate
                            }
                        }
                        
                        room.findOneAndUpdate( {"roomNo" : req.body.roomNo} , {"reserved" : array })
                            .then(res.send("Done Update"))
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
                })
                .catch((err) => console.log(err))})
        .catch(err => console.log(err))
    
})

//delete a room reservation 
app.delete('/room/:id', requireAuth,   (req,res) =>{
    
    roomReservation.findByIdAndDelete( {_id : req.params.id} )
        .then((reservation) => {     
            

//for the room database
            room.findOne({"roomNo" : reservation.roomNo})
                .then( (rooms) => {                    
                    let array = rooms.reserved
                    
                    for(let i =0; i<array.length; i++){
                        if(array[i].from.valueOf() === reservation.checkInDate.valueOf()){
                            array.splice(i,1)
                            console.log(array)
                        }
                    }

                    room.findOneAndUpdate( {"roomNo" : reservation.roomNo} , {"reserved" : array })
                        .then(console.log("Done Update"))
                        .catch(err => {
                            //res.send(err)
                            console.log(err.message)
                        })
                })
                .catch(err => {
                   // res.send(err)
                    console.log(err.message)
                })
                res.send("Deleted successfully")

        })
        .catch(err => {
            console.log(err.message)
            res.send(err)
            
        })


    
})

app.post('/addRoom',  (req, res) =>{
    
    (new room ({
        "roomNo" : req.body.roomNo,
        "reserved" : req.body.reserved,
        "rate": req.body.rate
    }))
    .save()
    .then(res.send(`room ${req.body.roomNo} is added `))
})

//http://localhost:3500/setRate/6
app.patch('/setRate/:roomNo', (req, res) =>{

    room.findOneAndUpdate( {"roomNo" : req.params.roomNo} , {"rate" : req.body.rate })
                            .then(res.send("Done Update"))
                            .catch(err => console.log(err))

})

app.get('/getRate/:roomNo', (req, res) =>{
    room.findOne({"roomNo" : req.params.roomNo})
        .then( (rooms) => res.send(`${rooms.rate}`) )
        .catch( (err) => res.send(err))
})


const server = app.listen(3500, () => {
    console.log('Listening to port 3500')
})

module.exports = server
var express = require('express');
var mongoose = require('mongoose');
const swaggerJSDoc=require('swagger-jsdoc');
const swaggerUI=require('swagger-ui-express');
var cookieParser = require('cookie-parser')
var { requireAuth } = require('../middleware/authentication')
var cors = require('cors')
var { authRole } = require('../middleware/authorization')

app = express();
app.use(cookieParser())
app.use(cors())

mongoose.Promise = global.Promise;

//Swagger
const swaggerOptions={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Finance Management API',
            description:'Api for finance management',
            servers:["http://localhost:3800"]
        }
    },
    apis:["bills.js"]
}

const swaggerDocs=swaggerJSDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));


// connect to the database
mongoose.connect('mongodb+srv://test:test@cluster0.tfqi1.mongodb.net/bills',{ useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false })
    .then(console.log('Connected to database "bills"'))
    .catch((err) => {console.log(err)})

app.use(express.json())

/**
 * @swagger
 * definitions:
 *  Bill:
 *   type: object
 *   properties:
 *    memberId:
 *     type: string
 *    date:
 *     type: string
 *    amount:
 *     type: integer
 *    gst:
 *     type: integer
 *    grandTotal:
 *     type: integer
 */

const Bill = require('../Models/Bill');

//methods: ADD, GET

//swagger for get

 /**
  * 
  * components:
  *  securitySchemes:
  *      bearerAuth:
  *          type: http
  *          schemes: bearer
  *          bearerFormat: JWT
  *  security:
  *     bearerAuth: []
  */

 /**
  * @swagger
  * /bill/{memberId}:
  *  get:
  *   summary: get member by id
  *   security:
  *    - bearerAuth: []
  *   description: create team
  *   parameters:
  *    - in: path
  *      name: memberId
  *      schema:
  *       type: string
  *      required: true
  *    - in: header
  *      name: authorization
  *      description: an authorization header
  *      required: true
  *      type: string
  *   responses:
  *    200:
  *     description: success
  *    500:
  *     description: error
  */

//Get bill by customer id
app.get('/bill/:memberId', requireAuth, authRole(['Manager','Owner','Receptionist']),(req, res) =>{
    Bill.find({ memberId : req.params.memberId})
        .then((bills) => res.send(bills))
        .catch((err) => {
            console.log(err.message)
            res.json(err)
        })
})

//get total income
//http://localhost:3800/income?start=2018-01-01&&end=2018-12-31
app.get('/income',requireAuth, authRole(['Manager','Owner']),(req, res) =>{
    const matchStart = Date.parse(req.query.start)
    const matchEnd = Date.parse(req.query.end)
    Bill.find({ date : {"$gt": new Date( matchStart ) ,"$lt": new Date( matchEnd ) }})
        .then((bill) => {
            let sum =0
            bill.forEach( elememt =>{
                sum+=elememt.grandTotal
            })
            res.send(`The total is ${sum}`)
        }
        )
        .catch((err) => res.send(err.message))
})

//add a bill(POST)
app.post('/bill',requireAuth, authRole(['Manager','Owner','Receptionist']), (req, res) =>{
    (new Bill ( { 'memberId' : req.body.memberId, 
                    'date' : req.body.date, 
                    'amount' : req.body.amount, 
                    'gst' : req.body.gst, 
                    'grandTotal' : req.body.grandTotal
                }))
        .save()
        .then((bill) => res.send(bill))
        .catch((err) => res.json(err))
})



const server1 = app.listen(3800, () => {
    console.log('Listening to port 3800')
})

module.exports = server1
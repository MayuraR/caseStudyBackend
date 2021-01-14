let chai = require('chai');
let chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
let server1 = require('../bills/bills');
let User = require('../Models/Users');

//Assertion Style

chai.should();
chai.use(chaiHttp);

const rootUser = new User({
    "userId" : "abc",
    "role" : "Owner",
    "password" : "abc1234"
});

let rootJwtToken = '';


before(() =>
  rootUser.save({})
    .then((savedRootUser) => {
        payload = {subject : rootUser.role}
        const rootToken = jwt.sign(payload, 'net ninja secret');
        rootJwtToken = `Bearer ${rootToken}`;
    })
);


after(() => {
    User.remove(() => {});
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.connection.close();
  });

//add bill successfully
  describe("POST /bill", () => {
    it("It should add bill", (done) =>{
      const billDetails =  { 
        "memberId" : "5fc29e69211d882b1cb6d737", 
        "date": "2020-01-01", 
        "amount" : 1000, 
        "gst" : 180, 
        "grandTotal" : 1180
    }
      chai.request(server1)
        .post("/bill")
        .set('Authorization', rootJwtToken)
        .send(billDetails)
        .end((err, response) =>{
          response.should.have.status(200);
          response.should.be.a('object');          
          response.body.should.have.property('gst');
          done();
        })
  })
  })

//failed to add bill because property "GST" is missing
  describe("POST /bill", () => {
    it("It should not add bill", (done) =>{
      const billDetails =  { 
        "memberId" : "5fc29e69211d882b1cb6d737", 
        "date": "2020-01-01", 
        "amount" : 1000, 
        "gst" : 180, 

    }
      chai.request(server1)
        .post("/bill")
        .set('Authorization', rootJwtToken)
        .send(billDetails)
        .end((err, response) =>{
          response.should.have.status(200);
          response.should.be.a('object');          
          response.body.should.have.property('_message').eq("Bill validation failed");
          response.body.should.have.property('message').eq("Bill validation failed: grandTotal: Path `grandTotal` is required.");
          done();
        })
  })
  })

//get income
describe("GET /income", () =>{
      it("It should return income", (done) =>{
          chai.request(server1)
          .get("/income?start=2018-01-01&&end=2018-12-31")
          .set('Authorization', rootJwtToken)
          .end((err, response) => {
              response.should.have.status(200);
              response.body.should.a('object');
            done();
          })
      })
  })
let chai = require('chai');
let chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
let server = require('../member/member');
let User = require('../Models/Users');
let item = 'woks';
let _id = "5fc2a382c4b02c364cf8cb2b"


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

//get all members
describe("GET /members", () =>{
  it("returns all members", (done) =>{
      chai.request(server)
      .get(`/members`)
      .set('Authorization', rootJwtToken)
      .end((err, response) => {
          response.should.have.status(200);
          response.body.should.a('array');
        done();
      })
  })
})

//get member by id
  describe("GET /member by id", () =>{
    it("returns a member", (done) =>{
        chai.request(server)
        .get(`/members/${_id}`)
        .set('Authorization', rootJwtToken)
        .end((err, response) => {
            response.should.have.status(200);
            response.body.should.a('array');
          done();
        })
    })
})

//add members
describe("POST /members", () => {
    it("It should not add inventory", (done) =>{
      const details = 
     { "name" : "ABC", 
      "gender" : "female", 
      "contact" : 987654321, 
      "email" : "rajadhyaksha.mayura@gmail.com"}
      chai.request(server)
        .post("/members")
        .set('Authorization', rootJwtToken)
        .send(details)
        .end((err, response) =>{
          response.should.have.status(200);
          response.should.be.a('object'); 
          done();
        })
  })
  })

//edit member details
describe("PATCH /members", () => {
    it("It should not add inventory", (done) =>{
      const details =  {
        "name" : "ABC", 
        "gender" : "female", 
        "contact" : 987654321, 
        "email" : "rajadhyaksha.mayura@gmail.com"
   }
      chai.request(server)
        .patch(`/members/${_id}`)
        .set('Authorization', rootJwtToken)
        .send(details)
        .end((err, response) =>{
          response.should.have.status(200);
          response.should.be.a('object'); 
          done();
        })
  })
  })
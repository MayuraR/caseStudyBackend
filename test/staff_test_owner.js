let chai = require('chai');
let chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
let server = require('../staff/staff');
let User = require('../Models/Users');
let _id = "5fd83b4dbbd32e137c35bbba"



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

//get allStaff
describe("GET /allStaff", () =>{
    it("It should the entire staff", (done) =>{
        chai.request(server)
        .get(`/allStaff`)
        .set('Authorization', rootJwtToken)
        .end((err, response) => {
            response.should.have.status(200);
            response.body.should.an('array');
          done();
        })
    })
})


//get staff by id
describe("GET /staff by id", () =>{
    it("It should return staff by id", (done) =>{
        chai.request(server)
        .get(`/staff/${_id}`)
        .set('Authorization', rootJwtToken)
        .end((err, response) => {
            response.should.have.status(200);
            response.body.should.an('array');
          done();
        })
    })
})

//add staff
describe("POST /staff", () => {
    it("It should add staff", (done) =>{
      const details =  {
        "name": "SFT",
        "department": "kitchen",
        "gender": "Female",
        "contact": 26436552,
        "email": "koij@sdft.com",
        "verificationDoc": "Aadhar",
        "salary": 20000
}
      chai.request(server)
        .post("/staff")
        .set('Authorization', rootJwtToken)
        .send(details)
        .end((err, response) =>{
          response.should.have.status(200);
          response.should.be.a('object'); 
          done();
        })
  })
  })

  // delete inventory 
  describe("DELETE /staff", () =>{
    it("Delete staff", (done) =>{
        chai.request(server)
        .delete(`/staff/5fda4473873e4437a44b1c02`)
        .set('Authorization', rootJwtToken)
        .end((err, response) => {
            response.should.have.status(200);
            response.body.should.a('object');
          done();
        })
    })
}) 

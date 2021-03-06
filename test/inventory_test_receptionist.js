let chai = require('chai');
let chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
let server = require('../inventory/inventory');
let User = require('../Models/Users');
let item = 'woks';
let inventory_id = "5fc341a592bde905109e2423"


//Assertion Style

chai.should();
chai.use(chaiHttp);

const rootUser = new User({
    "userId" : "abc",
    "role" : "Receptionist",
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


//get inventory
  describe("GET /inventory", () =>{
    it("It should not return an array of inventories because of unauthorized access", (done) =>{
        chai.request(server)
        .get(`/inventory/${item}`)
        .end((err, response) => {
            response.should.have.status(401);
            response.body.should.a('object');
          done();
        })
    })
})

//failed to add inventory because of invalid access
describe("POST /inventory", () => {
    it("It should not add inventory", (done) =>{
      const inventoryDetails =  {
        "date" : "2020-01-01",
       "area" : "kitchen", 
       "item" : "knives",
       "quantity" : "10"
   }
      chai.request(server)
        .post("/inventory")
        .set('Authorization', rootJwtToken)
        .send(inventoryDetails)
        .end((err, response) =>{
          response.should.have.status(401);
          response.should.be.a('object'); 
          done();
        })
  })
  })

  //failed to delete inventory because of failed access
  describe("DELETE /inventory", () =>{
    it("It should not delete anything because of unauthorized access", (done) =>{
        chai.request(server)
        .delete(`/inventory/${inventory_id}`)
        .set('Authorization', rootJwtToken)
        .end((err, response) => {
            response.should.have.status(401);
            response.body.should.a('object');
          done();
        })
    })
}) 

//failed to add inventory because of invalid access
describe("PATCH /inventory", () => {
    it("It should not add inventory", (done) =>{
      const inventoryDetails =  {
        "date" : "2020-01-01",
       "area" : "kitchen", 
       "item" : "knives",
       "quantity" : "10"
   }
      chai.request(server)
        .patch(`/inventory/${inventory_id}`)
        .set('Authorization', rootJwtToken)
        .send(inventoryDetails)
        .end((err, response) =>{
          response.should.have.status(401);
          response.should.be.a('object'); 
          done();
        })
  })
  })
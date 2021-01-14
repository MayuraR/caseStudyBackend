let chai = require('chai');
let chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
let server = require('../reservation/reservation');
let User = require('../Models/Users');
let _id = "5fc678bfbce755291cd4ef4b"
let patch_id = "5fd5c1abe2461c2f00ccdc15";
let roomNo = 1;

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


//add reservation successfully
  describe("POST /room", () => {
    it("It should add reservation", (done) =>{
      const details =  {
        "membershipId": "5fd3d1d844014b3144599d91",
            "noOfChildren": 1,
            "noOfAdults": 2,
            "checkInDate": "2020-06-13T00:00:00.000Z",
            "checkOutDate": "2020-06-14T00:00:00.000Z",
            "roomNo": 6,
            "verificationDoc": "Aadhar",
            "additionalRequirements": "none"
    }
      chai.request(server)
        .post("/room")
        .set('Authorization', rootJwtToken)
        .send(details)
        .end((err, response) =>{
          response.should.have.status(200);
          response.should.be.a('object');
          done();
        })
  })
  })


//delete reservation
describe("DELETE /room", () =>{
    it("It should delete successfully", (done) =>{
        chai.request(server)
        .delete(`/room/${_id}`)
        .set('Authorization', rootJwtToken)
        .end((err, response) => {
            response.should.have.status(200);
            response.body.should.a('object');
          done();
        })
    })
}) 


//get room
describe("GET /room", () =>{
      it("It should return resevation details", (done) =>{
          chai.request(server)
          .get("/room/5fdb1ac180121b36f05ba8d8")
          .set('Authorization', rootJwtToken)
          .end((err, response) => {
              response.should.have.status(200);
              response.body.should.a('array');
            done();
          })
      })
  })



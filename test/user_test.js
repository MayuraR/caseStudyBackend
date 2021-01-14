let chai = require('chai');
let chaiHttp = require('chai-http')
let server = require('../users/users')



//Assertion Style

chai.should();
chai.use(chaiHttp);

describe("POST /login", () => {
  it("It should login", (done) =>{
    const userCredentials =  {
      "userId" : "mayura",
      "password" : "mayura4"
  }
    chai.request(server)
      .post("/login")
      .send(userCredentials)
      .end((err, response) =>{
        response.should.be.a('object');
        done();
      })
})
})


describe("POST /signup", () => {
  it("It should add a user", (done) =>{
    const userCredentials =  {
      "userId" : "abc",
      "role" : "receptionist",
      "password" : "abc1234"
  }
    chai.request(server)
      .post("/signup")
      .send(userCredentials)
      .end((err, response) =>{
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('role');
        response.body.should.have.property('userId');
        response.body.should.have.property('password');
        done();
      })
})
})


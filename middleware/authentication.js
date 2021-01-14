const jwt = require('jsonwebtoken');
let r = '';

const requireAuth = (req, res, next) => {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'net ninja secret')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  r = payload.subject
  console.log(r)
  console.log(token)
  next()
};

const role = () => {
  return r;
}

module.exports = { requireAuth, role };
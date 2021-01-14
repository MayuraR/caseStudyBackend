const { role } = require('./authentication')

function authRole(roles) {
  
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return (req, res, next) => {
        console.log(roles)
      
        if(roles.length ==0){
            next()
        }
        else if (!roles.includes(role())) {
            res.status(401)
            return res.send('Not allowed')
      }
      else{
        next()
      }
      
    }
  }

module.exports = { authRole }
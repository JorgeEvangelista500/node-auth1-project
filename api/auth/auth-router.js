// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model')
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require('./auth-middleware')


router.post('/register',checkPasswordLength, checkUsernameFree, (req, res, next) => {
    const user = req.body
    const hash = bcrypt.hashSync(user.password, 12)
    user.password = hash
    Users.add(user)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
  })

router.post('/login', checkUsernameExists, (req, res, next) => {
  const password = req.body.password
  if(bcrypt.compareSync(password, req.user.password)) {
    req.session.user = req.user;
    res.status(200).json({message: `Welcome ${req.user.username}!`});
  }else {
    next({ status:401, message: "Invalid credentials"});
  }
}) 

router.get('/logout',  (req, res, next) => {
    if(req.session.user) {
      req.session.destroy(err => {
        if (err){
          next(err)
        } else {
          res.status(200).json({message: "logged out"})
        }
      })
    } else {
      res.status(200).json({message: "no session"})
    }
})
/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route  GET api/auth
// @desc   Test route
// @access Public
router.get('/', auth, async(req, res)=>{
  try {
    const user = await User.findById(req.user.id).select('-password'); // remove the password from token
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route  POST api/auth
// @desc   Authenticate user & get token
// @access Public
router.post('/', [
  check(
    'email',
    'Please include a valid email').isEmail(),
  check(
    'password',
    'Password is required'
  ).exists() // in this case, emypt field is fine
], 
async (req, res)=> {
  const errors = validationResult(req);
  if(!errors.isEmpty()){ // only if the response returns errors
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const { email, password } = req.body; // get from the request

  try {
    // See if user exists
    let user = await User.findOne({
      email // search by the email in response
    });

    if (!user){
      return res.status(400).json({errors:[{ msg: 'Invalid Credentials' }]});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({errors:[{ msg: 'Invalid Credentials' }]}); // Post the same message as above so user doesn't know if the account exists
    }

    const payload ={
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload, // must be an object
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // show the token in Postman's response
      }
    );
  } catch (err){
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User'); // import User model

// @route  POST api/users
// @desc   Register user
// @access Public
router.post('/', [
  check('name', 'Name is required')
  .not() // they are the default methods from express-validator/check
  .isEmpty(),
  check(
    'email',
    'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({min: 6})
], 
async (req, res)=> {
  const errors = validationResult(req);
  if(!errors.isEmpty()){ // only if the response returns errors
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const { name, email, password } = req.body;

  try {
    // See if user exists
    let user = await User.findOne({
      email // search by the email in response
    });

    if (user){
      return res.status(400).json({errors:[{ msg: 'User already exists' }]}); // this looks exactly same as the error above
    }

    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: '200', // default size
      r: 'pg',
      d: 'mm'
    });

    user = new User({
      name,
      email,
      avatar,
      password
    }); // just an instance

    // Encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return JSON webtoken, once users register, then they should be logged in right away
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
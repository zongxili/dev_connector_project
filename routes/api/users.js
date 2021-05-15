const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

const User = require('../../models/User'); // import User model
const { getMaxListeners } = require('../../models/User');

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
async(req, res)=> {
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
      email
    });

    if (user){
      return res.status(400).json({errors:[{ msg: 'User already exists' }]}); // this looks exactly same
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
    // Return JSON webtoken, once user registers, then he should be logged in right away



    res.send('User Rigistered'); // if no errors, the reponse should be this text
  } catch (err){
    console.error(err.message);
    res.status(500).send('Server error');
  }

});

module.exports = router;
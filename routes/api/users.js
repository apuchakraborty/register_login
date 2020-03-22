const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');


//models inc
const User = require('../../models/User');

// @route POST api/users
// @desc Register users
// @access public

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'email is required').isEmail(),
    check('password', 'Password is required').isLength({ min: 6 })
], async(req, res) => {
    // console.log(req.body)
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
  
    try {
        
    //user exists
    let user = await User.findOne({ email });
   
    if(user){
       return res.status(400).json({ errors: [{ msg: 'user already exists'}]});
    }
       //gravatar
       const avatar = gravatar.url(email, {
           s: '200',
           r: 'pg',
           d: 'mm'
       })
   
       user = new User({
           name,
           email,
           avatar,
           password
       });
       // bycrypt
       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(password, salt);
   
       await user.save();
   
       
       //without json webtoken -> res.send('users registered');
       //jsonwebtoken
       const payload ={
           user: {
               id: user.id
           }
       };
       jwt.sign(
           payload,
           config.get('jwtSecret'),
           { expiresIn: 36000 },
           (err, token) => {
               if(err) throw err;
               res.json({ token })
           }
       );
    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
    }

    //res.send('users name');
});

module.exports = router;
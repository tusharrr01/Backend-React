import express from 'express';
// const User = require('../models/User');
import User from '../models/User.js';
// const { validationResult } = require('express-validator');
import {validationResult,body} from 'express-validator';

const router = express.Router();
// create a user using : post "/api/auth" Doesn't require auth 
router.post('/',[
    body('name','Please enter a valid name').isLength({ min: 3 }),
    body('email','please enter a unique name').isEmail(),
    body('password','passwoed must be atleast 5 digits').isLength(5),
],(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      }).then(user => res.json(user))
      .catch(err => {console.log(err)
        res.json({error : 'please enter a unique email',message: err.message})})
})

export default router;
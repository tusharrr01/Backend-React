import express from 'express';
// const User = require('../models/User');
import User from '../models/User.js';


const router = express.Router();

// create a user using : post "/api/auth" Doesn't require auth 
router.post('/',(req,res)=>{
    console.log(req.body)
    const user = new User(req.body)
    user.save()
    res.json(req.body)

})

export default router;
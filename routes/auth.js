import express from 'express';
import User from '../models/User.js';
import { validationResult, body } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fetchuser from '../middleware/fetchuser.js';

const JWT_SECRET = 'error';

const router = express.Router();
//ROUTE 1 : Create A User Using : POST "/api/auth/createuser" | no login reqired
router.post('/createuser', [
    body('name', 'Please enter a valid name').isLength({ min: 3 }),
    body('email', 'please enter a valid email').isEmail(),
    body('password', 'passwoed must be atleast 5 digits').isLength(5),
    ], async (req, res) => {
        // if there are error ,return bad request and errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // check user with this email exist or not 
        try {
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json({ error: "sorry user with this email is already exists" })
            }

            const salt = await bcrypt.genSalt(10);
            const SecPassword = await  bcrypt.hash(req.body.password, salt) 

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: SecPassword,
            });
            const data = {
                user:{
                    id:user.id
                }
            }
            const authToken = jwt.sign(data,JWT_SECRET);
            
            res.json({authToken})
            // res.json(user)
        } catch (error) {
            console.log(error.message);
            res.status(500).send("internal server error")
        }
})

//ROUTE 2 : Authenticate A User Using : POST "/api/auth/login" | No login reqired
router.post('/login', [
    body('email', 'please enter a valid email').isEmail(),
    body('password', 'passwoed can not be blank').exists(),
    ], async (req, res) => {
        // if there are error ,return bad request and errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {email, password} = req.body; 
        try {
            let user =await User.findOne({email});
            if(!user){
                return res.status(400).json({ errors: "email or password is not valid"});
            }

            const passwordCompare = await bcrypt.compare(password,user.password);
            if(!passwordCompare){
                return res.status(400).json({ errors: "email or password is not valid"});
            }
            const data = {
                user:{
                    id:user.id
                }
            }
            const authToken = jwt.sign(data,JWT_SECRET);
            res.json({authToken})

        } catch (error) {
            console.log(error.message);
            res.status(500).send("internal server error")
        }
})

//ROUTE 3 : Get Logedin user Detail Using  : POST "/api/auth/getuser" | Login reqired
router.post('/getuser',fetchuser, async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select("-password");
            res.send(user)
        } catch (error) {
            console.log(error.message);
            res.status(500).send("internal server error")
        }
})

export default router;
import express from 'express';
import User from '../models/User.js';
import { validationResult, body } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'error';

const router = express.Router();
// create a user using : post "/api/auth/createuser" | does not require auth 
router.post('/createuser', [
    body('name', 'Please enter a valid name').isLength({ min: 3 }),
    body('email', 'please enter a unique email').isEmail(),
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
            res.status(500).send("some error occured")
        }
})

export default router;
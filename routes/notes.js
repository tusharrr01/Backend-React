import { Router } from 'express';
const router = Router();
import fetchuser from '../middleware/fetchuser.js';
import Notes from '../models/Notes.js';
import { body, validationResult } from 'express-validator';



//ROUTE 1 : Get All Notes Using : POST "/api/auth/fetchallnotes" | Login reqired
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes)
})

//ROUTE 1 : Add Notes Using : POST "/api/auth/addnote" | Login reqired
router.post('/addnote', fetchuser, [
    body('title', 'Please enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 digits').isLength(5),], async (req, res) => {
        const { title, description, tag } = req.body;
        // if there are error ,return bad request and errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savednote = await note.save()
        res.json(savednote)
    })

export default router
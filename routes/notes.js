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

//ROUTE 2 : Add Notes Using : POST "/api/auth/addnote" | Login reqired
router.post('/addnote', fetchuser, [
    body('title', 'Please enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 digits').isLength(5),], async (req, res) => {
        try {
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
        } catch (error) {
            console.log(error.message);
            res.status(500).send("internal server error")
        }
    })

//ROUTE 3 : Updating an Notes Using : PUT "/api/auth/updatenote/:id" | Login reqired
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // create a new note 
        const newNote = {}
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // find the note to be updated or update it 
        let note = await Notes.findById(req.params.id);
        if (!note) { res.status(404).send("Not Found") };

        // Allow updation only if the user own this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error")
    }
})

//ROUTE 4 : Delete Notes Using : Delete "/api/auth/deletenote/:id" | Login reqired
router.put('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // find the note to be updated or update it 
        let note = await Notes.findById(req.params.id);
        if (!note) { res.status(404).send("Not Found") };

        // Allow deletion only if the user own this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "success": "Note has Been Deleted", Note: note })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error")
    }
})

export default router
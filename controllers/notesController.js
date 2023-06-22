const Note = require('../models/Note')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// get all notes
const getAllNotes = asyncHandler(async (req,res) => {
    const notes = await Note.find().lean()

    if(!notes?.length) {
        return res.status(400).json({message: 'No Notes were found!'})
    } 
    res.json(notes)


    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return {...note, username: user.username}
    }))

    res.json(notesWithUser)
})

//Create a new note

const createNewNotes = asyncHandler(async (req,res) => {
    const {user, title, text} = req.body

    if (!user || !title || !text) {
        return res.status(400).json({message: 'All fields required!'})
    }

    //check for a duplicate note title

    const duplicate = await Note.findOne({title}).lean().exec()

    if(duplicate) {
        res.status(201).json({message: "New note has been created!"})
    } else {
        res.status(400).json({message: "Invalid note data received"})
    }
})

// update a note

const updateNote = asyncHandler(async (req,res) => {
    const {id, user, title, text, completed} = req.body 

    if(!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json(({message: "All fields are required"}))
        
    }
    //check notes exist
    const note = await Note.findById(id).exec()

    if(!note) {
        return res.status(400).json({message:"Note not found!"})
    }

    //check for same titles
    const duplicate = await Note.findOne({title}).lean().exec()

    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: "Duplicate note title"})
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed =completed

    const updateNotes = await note.save()

    res.json(`'${updateNote.title} updated!`)
})

//Deleting a note
const deleteNote = asyncHandler(async (req,res) => {
    const {id} = req.body

    if(!id) {
        return res.status(400).json({message: "Note ID required!"})
    }

    const note = await Note.findById(id).exec()

    if(!note) {
        return res.status(400).json({message: "No note found!"})
    }

    const result = await note.deleteOne()

    const reply = `Note ''${result.title} with ID ''${result._id} deleted!`

    res.json(reply)

})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}
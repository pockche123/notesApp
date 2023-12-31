const express = require("express")
const notesRouter = express.Router();

const {
    createNote,
    getAllNotes,
    getNote,
    deleteNote,
    updateNote,
    getAllNotesByFolder,
    getAllNotesByName,
    getAllNotesByUser

} = require('../controllers/notes')

notesRouter.post('/', createNote)
notesRouter.get('/', getAllNotes)
notesRouter.get("/folder/:folderId", getAllNotesByFolder)
notesRouter.get("/name/:name", getAllNotesByName)
notesRouter.get("/user/:userId", getAllNotesByUser)
notesRouter.get('/:id', getNote)
notesRouter.delete('/:id', deleteNote)
notesRouter.patch('/:id', updateNote)

module.exports = notesRouter
const express = require('express');
const router = express.Router();
const { getNotes, viewNote, addNote, deleteNote } = require('./controller');
router.get('/', getNotes);
router.get('/view/:id', viewNote);
router.post('/add', addNote);
router.delete('/:id', deleteNote);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getSubjects, addSubject, updateSubject, deleteSubject } = require('./controller');
router.get('/', getSubjects);
router.post('/add', addSubject);
router.put('/update/:id', updateSubject);
router.delete('/:id', deleteSubject);

module.exports = router;

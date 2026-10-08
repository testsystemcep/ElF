const express = require('express');
const router = express.Router();
const { getAssignments, addAssignment, updateAssignment, deleteAssignment } = require('./controller');
router.get('/', getAssignments);
router.post('/add', addAssignment);
router.put('/update/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getExamTimetable, addExam, updateExam, deleteExam } = require('./controller');
router.get('/', getExamTimetable);
router.post('/', addExam); // Standard POST / exams
router.post('/add', addExam); // Legacy / matching user's existing structure
router.put('/:id', updateExam);
router.put('/update/:id', updateExam); // Legacy support
router.delete('/:id', deleteExam);

module.exports = router;

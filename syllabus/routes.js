const express = require('express');
const router = express.Router();
const { getSyllabus, addSyllabus, updateSyllabus, deleteSyllabus } = require('./controller');

router.get('/', getSyllabus);
router.post('/add', addSyllabus);
router.put('/update/:id', updateSyllabus);
router.delete('/:id', deleteSyllabus);

module.exports = router;

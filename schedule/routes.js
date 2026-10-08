const express = require('express');
const router = express.Router();
const { getSchedule, addSchedule, updateSchedule, deleteSchedule } = require('./controller');
router.get('/', getSchedule);
router.post('/add', addSchedule);
router.put('/update/:id', updateSchedule);
router.delete('/:id', deleteSchedule);
module.exports = router;

const express = require('express');
const router = express.Router();
const { getImps, addImp, updateImp, deleteImp } = require('./controller');

router.get('/', getImps);
router.post('/add', addImp);
router.put('/update/:id', updateImp);
router.delete('/:id', deleteImp);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getNews, addNews, updateNews, deleteNews } = require('./controller');

router.get('/', getNews);
router.post('/add', addNews);
router.put('/update/:id', updateNews);
router.delete('/:id', deleteNews);

module.exports = router;

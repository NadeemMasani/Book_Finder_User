const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search-controller');




router.get('/:book', searchController.search);
router.get('/books/:id', searchController.getLibrariesByBookId);

module.exports = router;
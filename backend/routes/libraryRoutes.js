const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const libraryController = require('../controllers/library-controller');


router.get('/', libraryController.getAllLibrary);
router.get('/:lid', libraryController.getLibraryById);
router.get('/:lid/books', libraryController.getBooksByLibrary);
router.get('/:lid/books/:bid', libraryController.getBookByID);
router.get('/load/data/new/libs', libraryController.load);


router.post(
    '/',
    [
        check('name').not().isEmpty(),
        check('address').not().isEmpty(),
        check('country').not().isEmpty(),
        check('city').not().isEmpty(),
        check('zip').not().isEmpty(),
    ],
    libraryController.createNewLibrary
);

router.post(
    '/:lid/',
    [
        check('name').not().isEmpty(),
        check('author').not().isEmpty(),
        check('isbn').not().isEmpty(),
        check('category').not().isEmpty(),
    ],
    libraryController.addBook
);

module.exports = router;



const { validationResult } = require('express-validator');
const Distance = require('geo-distance');
const turf = require('@turf/turf');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const location = require('../util/location');

const Library = require('../models/library');
const Book = require('../models/books');
const Temp = require('../models/temp');
const Tempbook = require('../models/tempbooks');




const getAllLibrary = async (req, res, next) => {
    const userLat = req.query.lat;
    const userLng = req.query.lng;
    const userLoc = {
        lat: userLat,
        lon: userLng
    }

    const from = turf.point([userLat, userLng]);
    const options = { units: 'miles' };
    let libraries;
    let lib1 = [];
    try {
        libraries = await Library.find();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the library.',
            500
        );
        return next(error);
    }

    if (!libraries) {
        const error = new HttpError(
            'Could not find any Library',
            404
        );
        return next(error);
    }
    for (let i = 0; i < libraries.length; i++) {

        const to = turf.point([libraries[i].location.lat, libraries[i].location.lng]);
        distance = turf.distance(from, to, options)
        // console.log(distance);
        lib1.push({
            name: libraries[i].name,
            address: libraries[i].address,
            books: libraries[i].books,
            country: libraries[i].country,
            city: libraries[i].city,
            location: libraries[i].location,
            zip: libraries[i].zip,
            zip4: libraries[i].zip4,
            _id: libraries[i]._id,
            distance: distance
        });

    }



    lib1.sort(function (a, b) {
        return a.distance - b.distance;
    });




    res.json({ libraries: lib1 });

};

const getLibraryById = async (req, res, next) => {
    const lid = req.params.lid;
    console.log(lid);
    let library;
    try {
        library = await Library.findById(lid);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the library.',
            500
        );
        return next(error);
    }

    if (!library) {
        const error = new HttpError(
            'Could not find Library for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ library: library.toObject({ getters: true }) });
};

const getBookByID = async (req, res, next) => {
    const bid = req.params.bid;
    console.log(bid);
    let book;
    try {
        book = await Book.findById(bid);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the library.',
            500
        );
        return next(error);
    }

    if (!book) {
        const error = new HttpError(
            'Could not find Library for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ book: book.toObject({ getters: true }) });

};

// const getBooksByLibrary = async (req, res, next) => {
//     const lid = req.params.lid;
//     // console.log(lid);
//     let library;
//     try {
//         library = await Library.findById(lid);
//     } catch (err) {
//         const error = new HttpError(
//             'Something went wrong, could not find the library.',
//             500
//         );
//         return next(error);
//     }

//     if (!library) {
//         const error = new HttpError(
//             'Could not find Library for the provided id.',
//             404
//         );
//         return next(error);
//     }

//     let allbooks = [];
//     try {
//         for (const book of library.books) {
//             const currBook = await Book.findById(book.id);
//             allbooks.push({
//                 name: currBook.name,
//                 author: currBook.author,
//                 category: currBook.category,
//                 isbn: currBook.isbn,
//                 tags: currBook.tags,
//                 count: book.count
//             });
//         }
//         // console.log(allbooks);
//     } catch (err) {
//         const error = new HttpError(
//             'Something went wrong error while getting books for the library',
//             404
//         );
//         return next(err);

//     }

//     // console.log(library.books);

//     res.json({ books: allbooks });

// }

const getBooksByLibrary = async (req, res, next) => {
    const lid = req.params.lid;
    let library;
    try {
        library = await Library.findById(lid);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the library.',
            500
        );
        return next(error);
    }

    if (!library) {
        const error = new HttpError(
            'Could not find Library for the provided id.',
            404
        );
        return next(error);
    }

    // console.log(library.books);

    let allbooks = [];
    try {
        for (const book of library.books) {
            const currBook = await Book.findById(book._id);
            if (currBook != null) {
                allbooks.push({
                    id: currBook._id,
                    name: currBook.name,
                    author: currBook.author,
                    category: currBook.category,
                    isbn: currBook.isbn,
                    // publisher: currBook.publisher,
                    count: book.count
                });
            }
        }
        // console.log(allbooks);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong error while getting books for the library',
            404
        );
        return next(err);

    }
    res.json({ books: allbooks });

}

const createNewLibrary = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { name, address, country, city, zip, zip4 } = req.body;
    let coordinates;
    try {
        coordinates = await location.getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdLibrary = new Library({
        name,
        address,
        location: coordinates,
        country,
        city,
        zip,
        zip4,
        books: []
    });

    try {
        await createdLibrary.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not create Library.',
            500
        );
        return next(error);
    }

    res.status(200).json({ library: createdLibrary.toObject({ getters: true }) });

};

const addBook = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { name, author, isbn, category, publisher } = req.body;
    const lid = req.params.lid;

    let library;
    try {
        library = await Library.findById(lid);
    } catch (err) {
        const error = new HttpError(
            'Adding book to library failed',
            500
        );
        return next(error);
    }
    if (!library) {
        const error = new HttpError('Could not find Library for provided Library id.', 404);
        return next(error);
    }

    // console.log(library);

    let existingbook;
    try {
        existingbook = await Book.findOne({ isbn: isbn });
    } catch (err) {
        const error = new HttpError(
            'Adding the new Book Failed',
            500
        );
        return next(error);

    }

    if (existingbook) {
        console.log(existingbook.lib);
        console.log(library.id);

        if (existingbook.lib.includes(library.id)) {
            const error = new HttpError('Book already exists in Library update the count', 404);
            return next(error);
        }
        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            existingbook.lib.push(library);
            await existingbook.save({ session: sess });
            library.books.push(existingbook);
            await library.save({ session: sess });
            await sess.commitTransaction();

        } catch (err) {
            const error = new HttpError(
                'Something went wrong, could add or create Book.',
                500
            );
            return next(err);

        }

        res.status(200).json({ book: existingbook.toObject({ getters: true }) });
    } else {

        const createdBook = new Book({
            name,
            author,
            isbn,
            tags,
            category,
            lib: lid
        });
        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await createdBook.save({ session: sess });
            library.books.push(createdBook);
            await library.save({ session: sess });
            await sess.commitTransaction();
        } catch (err) {
            const error = new HttpError(
                'Something went wrong, could not create Library.',
                500
            );
            return next(error);
        }

        res.status(200).json({ book: createdBook.toObject({ getters: true }) });
    }



};

const load = async (req, res, next) => {
    // let coll;
    // try {
    //     coll = await Temp.find();
    // } catch (err) {
    //     const error = new HttpError(
    //         'Loading Failed',
    //         500
    //     );
    //     return next(error);
    // }

    // for (const lib of coll) {
    //     const { name, address, country, city, zip, zip4 } = lib;
    //     let coordinates;
    //     try {
    //         coordinates = await getCoordsForAddress(address);
    //         const createdLibrary = new Library({
    //             name: name,
    //             address: address,
    //             location: coordinates,
    //             country: country,
    //             city: city,
    //             zip: zip,
    //             zip4: zip4,
    //             books: []
    //         });

    //         await createdLibrary.save();
    //         console.log(name);
    //     } catch (error) {
    //         return next(error);
    //     }

    // }

    let books;

    libs = ["60596178c7fffc1cf043b08c", "60596179c7fffc1cf043b08d", "60596179c7fffc1cf043b08e", "6059617ac7fffc1cf043b08f", "6059617ac7fffc1cf043b090", "6059617ac7fffc1cf043b091", "6059617bc7fffc1cf043b092", "6059617bc7fffc1cf043b093"]

    try {

        books = await Tempbook.find().limit(100);
        console.log(books.length);

        for (const book of books) {
            for (const lib of libs) {
                // console.log(book.name);
                // console.log(lib);
                const { name, author, isbn, category, publisher } = book;
                const lid = lib;

                let library;
                try {
                    library = await Library.findById(lid);
                } catch (err) {
                    const error = new HttpError(
                        'Adding book to library failed',
                        500
                    );
                    return next(error);
                }
                // console.log(library)
                if (!library) {
                    const error = new HttpError('Could not find Library for provided Library id.', 404);
                    return next(error);
                }

                let existingbook;
                try {
                    existingbook = await Book.findOne({ isbn: isbn });
                } catch (err) {
                    const error = new HttpError(
                        'Adding the new Book Failed',
                        500
                    );
                    return next(error);

                }
                // console.log(existingbook);

                if (existingbook) {
                    // console.log(existingbook.lib);
                    // console.log(library.id);

                    if (existingbook.lib.includes(library.id)) {
                        const error = new HttpError('Book already exists in Library update the count', 404);
                        return next(error);
                    }
                    try {
                        const sess = await mongoose.startSession();
                        sess.startTransaction();
                        existingbook.lib.push(library);
                        await existingbook.save({ session: sess });
                        library.books.push(existingbook);
                        await library.save({ session: sess });
                        await sess.commitTransaction();

                    } catch (err) {
                        const error = new HttpError(
                            'Something went wrong, could add or create Book.',
                            500
                        );
                        return next(err);

                    }

                }
                else {
                    const createdBook = new Book({
                        name,
                        author,
                        isbn,
                        category,
                        publisher,
                        lib: lid
                    });
                    try {
                        const sess = await mongoose.startSession();
                        sess.startTransaction();
                        await createdBook.save({ session: sess });
                        library.books.push(createdBook);
                        await library.save({ session: sess });
                        await sess.commitTransaction();
                    } catch (err) {
                        const error = new HttpError(
                            'idr aa raha.',
                            500
                        );
                        return next(err);
                    }
                }

                console.log(book.name);
                console.log(book.isbn);
                console.log(lib);

            }
        }
    } catch (err) {
        return next(err);

    }


    res.status(200).json({ load: "done!!" });
};

exports.createNewLibrary = createNewLibrary;
exports.addBook = addBook;
exports.getLibraryById = getLibraryById;
exports.getBooksByLibrary = getBooksByLibrary;
exports.getBookByID = getBookByID;
exports.getAllLibrary = getAllLibrary;
exports.load = load;
const HttpError = require('../models/http-error');
const turf = require('@turf/turf');
const mongoose = require('mongoose');
const Book = require('../models/books');
const Library = require('../models/library');
const library = require('../models/library');
const location = require('../util/location');

const search = async (req, res, next) => {
    const searchBook = req.params.book;
    const radio = req.query.radio;

    let books;
    try {

        if (radio === "name") {
            books = await Book.find({
                $text:
                {
                    $search: searchBook,
                    $caseSensitive: false
                }
            });

        } else if (radio === "isbn") {
            console.log("Hi");
            books = await Book.find({ "isbn": searchBook });

        } else {
            books = await Book.find({ "category": searchBook });

        }
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the book.',
            500
        );
        return next(error);
    }

    if (!books) {
        const error = new HttpError(
            'No books with the specified keyword found',
            404
        );
        return next(error);
    }
    res.json({ books: books });

};

const getLibrariesByBookId = async (req, res, next) => {

    const bookId = req.params.id;
    // console.log(req.query.lat);
    const userLat = req.query.lat;
    const userLng = req.query.lng;
    // console.log(req.query.lng);

    let book;
    let libIds;
    let libraries = [];
    let lib1 = [];
    const from = turf.point([userLat, userLng]);
    const options = { units: 'miles' };
    try {
        book = await Book.findById(bookId);
        libIds = book.lib;
        // console.log(libIds);

        for (libId in libIds) {
            // console.log(libIds[libId]);
            const temp = await Library.findById(libIds[libId]);
            libraries.push(temp);
        }

        //sort based of user location

        // 



        for (let i = 0; i < libraries.length; i++) {
            // const to = turf.point([libraries[i].location.lat, libraries[i].location.lng]);
            // distance = turf.distance(from, to, options);
            const data = await location.getMilesAndTime(userLat, userLng, libraries[i].location.lat, libraries[i].location.lng);
            const distance = data.rows[0].elements[0].distance.text;
            const time = data.rows[0].elements[0].duration.text
            console.log(parseFloat(distance.split(" ")[0].replace(',', '')));

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
                distance: distance,
                time: time
            });

        }



        lib1.sort(function (a, b) {
            const a1 = parseFloat(a.distance.split(" ")[0].replace(',', ''));
            const b1 = parseFloat(b.distance.split(" ")[0].replace(',', ''));
            return a1 - b1;
        });

        // console.log(li1b1);

    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the book with given id.',
            500
        );
        console.log(err);
        return next(err);

    }

    res.json({ libraries: lib1 });

};
exports.search = search;
exports.getLibrariesByBookId = getLibrariesByBookId;
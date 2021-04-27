import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import BookList from '../components/Books/BookList';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { AuthContext } from '../../shared/auth-context';
import ReactPaginate from 'react-paginate';
import './ListBooks.css';
const ListBooks = () => {
    const auth = useContext(AuthContext);
    const [books, setBooks] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const lid = useParams().lid;

    useEffect(() => {
        const fetchBooks = async () => {

            setIsLoading(true);
            console.log(lid);
            console.log(auth.lattitude);
            const url = `${process.env.REACT_APP_SERVER_URL}/api/library/${lid}/books`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.books) {
                console.log(data.books);
                setBooks(data.books);
            } else {
                setBooks([]);
            }
            setIsLoading(false);
        }
        fetchBooks();
    }, [lid]);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    let currentBooks;
    if (books) {
        currentBooks = books.slice(indexOfFirstPost, indexOfLastPost);
    }

    const paginate = pageNumber => {
        setCurrentPage(pageNumber.selected + 1);
        console.log(pageNumber);
    };


    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    return (

        <div className='container'>
            {!isLoading && books && (<BookList items={currentBooks} />)}
            {books && books.length > 0 && <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(books.length / 5)}
                marginPagesDisplayed={3}
                pageRangeDisplayed={5}
                onPageChange={paginate}
                containerClassName={'pagination'}
                activeClassName={'active'}
                pageClassName={'page-link'}
                previousClassName={'prev-link'}
                nextClassName={'next-link'}
                pageLinkClassName={'a-link'}
            />}
        </div>


    );
}

export default ListBooks;

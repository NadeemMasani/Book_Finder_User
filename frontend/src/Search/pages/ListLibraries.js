import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import ReactPaginate from 'react-paginate';

import LibraryList from '../components/LibraryList';
import LoadingSpinner from '../../shared/LoadingSpinner';
import './ListLibraries.css'
const ListLibraries = () => {
    const bookId = useParams().id;
    const location = useLocation();
    const { name, lat, lng } = location.state;
    const [loadedLibs, setLoadedLibs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);


    useEffect(() => {
        const fetchLibs = async () => {

            try {
                setIsLoading(true);
                console.log(lat);
                const url = `${process.env.REACT_APP_SERVER_URL}/api/search/books/${bookId}?lat=${lat}&lng=${lng}`;
                const response = await fetch(url);
                const data = await response.json();
                console.log(data.libraries);

                setLoadedLibs(data.libraries);
                setIsLoading(false);
            } catch (err) {

            }
        };
        fetchLibs();

    }, [bookId, lat, lng]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentLibs = loadedLibs.slice(indexOfFirstPost, indexOfLastPost);


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
            <h2 className="book-name">List of Libraries with Book : {name}</h2>
            {!isLoading && loadedLibs && (<LibraryList items={currentLibs} />)}
            <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(loadedLibs.length / 5)}
                marginPagesDisplayed={3}
                pageRangeDisplayed={5}
                onPageChange={paginate}
                containerClassName={'pagination'}
                activeClassName={'active'}
                pageClassName={'page-link'}
                previousClassName={'prev-link'}
                nextClassName={'next-link'}
                pageLinkClassName={'a-link'}
            />
        </div>
    )
}

export default ListLibraries

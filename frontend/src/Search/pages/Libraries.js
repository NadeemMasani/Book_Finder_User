import React, { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';

import './Libraries.css';
// import Pagination from '../components/Pagination';
import LoadingSpinner from '../../shared/LoadingSpinner';
import LibraryList from '../components/LibraryList';
import { AuthContext } from '../../shared/auth-context';


const Libraries = () => {
    const [loadedLibs, setLoadedLibs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const auth = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    useEffect(() => {
        const fetchLibs = async () => {
            try {
                setIsLoading(true);
                console.log(auth.lattitude);
                console.log(auth.longitude);
                const url = `${process.env.REACT_APP_SERVER_URL}/api/library?lat=${auth.lattitude}&lng=${auth.longitude}`;
                const response = await fetch(url);
                const data = await response.json();
                console.log(data.libraries);

                setLoadedLibs(data.libraries);

                setIsLoading(false);
            } catch (err) {

            }
        };
        fetchLibs();

    }, []);

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

            {!isLoading && loadedLibs && (<LibraryList items={currentLibs} />)}
            {/* {<Pagination postsPerPage={postsPerPage}
                totalPosts={loadedLibs.length}
                paginate={paginate}
                currentPage={currentPage} />} */}
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

export default Libraries

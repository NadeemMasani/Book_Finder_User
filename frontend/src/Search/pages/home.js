import React, { useState, useEffect, useContext } from 'react';
import SearchBar from "../components/SearchBar";
import Button from "../../shared/Button";
import BookList from '../components/BookList';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { AuthContext } from '../../shared/auth-context';
import ReactPaginate from 'react-paginate';




import './home.css';

const Search = () => {
    const auth = useContext(AuthContext);
    const [keyword, setKeyword] = useState('');
    const [books, setBooks] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [lattitide, setLattitude] = useState();
    const [longitude, setLongitude] = useState();
    const [radio, setRadio] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);





    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const url = `${process.env.REACT_APP_SERVER_URL}/api/search/${keyword}?lat=${lattitide}&lng=${longitude}&radio=${radio}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.books) {
            setBooks(data.books);
        } else {
            setBooks([]);
        }
        setIsLoading(false);
        // send keyword to backend and get results;
        // console.log(keyword);
    }



    useEffect(() => {
        if ("geolocation" in navigator) {
            console.log("avail");
            navigator.geolocation.getCurrentPosition((pos) => {
                // console.log(pos.coords.latitude);
                setLattitude(pos.coords.latitude);
                setLongitude(pos.coords.longitude);
                auth.setLat(pos.coords.latitude);
                auth.setLng(pos.coords.longitude);
            });
        } else {
            console.log("Not");
        }

    }, []);

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

    const onChangeValue = (event) => {
        console.log(event.target.value);
        setRadio(event.target.value);
    };



    return (
        <React.Fragment>
            <div className="radio">
                <input
                    type="radio"
                    value="name"
                    name="name"
                    checked={radio === "name"}
                    onChange={onChangeValue}
                />
                    Name/Author
                    <input
                    type="radio"
                    value="isbn"
                    name="isbn"
                    checked={radio === "isbn"}
                    onChange={onChangeValue}
                />
                    ISBN Number
                    <input
                    type="radio"
                    value="category"
                    name="category"
                    checked={radio === "category"}
                    onChange={onChangeValue}
                />
                    Category
                </div>
            <div className="search-container">
                <form onSubmit={onSubmitHandler} className='form-style'>

                    <SearchBar
                        placeholder="Search"
                        onChange={(e) => setKeyword(e.target.value)}
                        value={keyword}
                    />
                    <Button type="submit" disabled={keyword.length === 0} >
                        Search
                    </Button>

                </form>

            </div>
            {!isLoading && books && lattitide && longitude && (<BookList items={currentBooks} lat={lattitide} lng={longitude} />)}
            { books && books.length > 0 && <ReactPaginate
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

        </React.Fragment>

    )
}

export default Search

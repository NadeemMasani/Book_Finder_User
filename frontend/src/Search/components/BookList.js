import React from 'react';
import BookItem from './BookItem';
import './BookList.css';

const BookList = props => {
    if (props.items.length === 0) {
        return (
            <div className="no-books">
                <h2>No Books Found Please try a different Search</h2>
            </div>
        )
    }
    return (
        <div>
            <ul className="books-list">
                {props.items.map(book => (
                    <BookItem
                        key={book._id}
                        id={book._id}
                        name={book.name}
                        author={book.author}
                        libraries={book.lib}
                        isbn={book.isbn}
                        category={book.category}
                        publisher={book.publisher}
                        lat={props.lat}
                        lng={props.lng}
                    />
                ))}
            </ul>
        </div>
    )
}

export default BookList;
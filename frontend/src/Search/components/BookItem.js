import React from 'react'
import Card from '../../shared/Card';
import Button from '../../shared/Button';
import './BookItem.css';

const BookItem = props => {

    // const showLibraries = () => {
    //     console.log(props.libraries)
    // };
    return (
        <li className='book_item'>
            <Card>
                <div className='book-position'>
                    <div className='align-left'>
                        <strong>{props.name}</strong>
                        <br />
                        <sub> Author : {props.author}</sub>
                        <br />
                        <sub> Category: {props.category}</sub>
                        <br />
                        <sub> ISBN No: {props.isbn}</sub>
                    </div>
                    <div className='align-right'>
                        <Button to={`/books/${props.id}`} name={props.name} lat={props.lat} lng={props.lng} > See Available Libraries</Button>
                    </div>
                </div>
            </Card>
        </li >
    )
}

export default BookItem

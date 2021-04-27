import React, { useState } from 'react';
import './pagination.css'

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
    const pageNumbers = [];
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(20);
    const max = 20;


    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    const onNextHandler = () => {
        if (currentPage + 1 <= totalPosts) {
            paginate(currentPage + 1);
            // if (currentPage >= 20) {
            //     setStart(start + 1);
            //     setEnd(end + 1);
            // }
        }



    };
    const onPrevHandler = () => {
        if (currentPage - 1 > 0) {
            paginate(currentPage - 1);

            // if (end - start <= 18) {
            //     setStart(start - 1);
            //     setEnd(end - 1);
            // }

        }
    };

    const onClickHandler = (number) => {
        paginate(number);
    };

    return (
        <div className='accc'>
            <div className='pagination'>
                <a onClick={onPrevHandler} >&laquo;</a>
                {pageNumbers.slice(start, end).map(number => (
                    <a onClick={onClickHandler.bind(this, number)} className={number === currentPage ? 'page-link-active' : 'page-link'}>
                        {number}
                    </a>
                ))}
                <a onClick={onNextHandler}>&raquo;</a>
            </div>
        </div>
    );
};

export default Pagination;

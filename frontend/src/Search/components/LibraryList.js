import React from 'react';
import LibraryItem from './LibraryItem';
import './LibraryList.css';

const LibraryList = props => {
    if (props.items.length === 0) {
        return (
            <div >
                <h2>No Libraries Found Please try a different Search</h2>
            </div>
        )
    }
    return (
        <div>
            <ul >
                {props.items.map(lib => (
                    <LibraryItem
                        key={lib._id}
                        id={lib._id}
                        name={lib.name}
                        address={lib.address}
                        location={lib.location}
                        city={lib.city}
                        zip={lib.zip}
                        country={lib.country}
                        distance={lib.distance}
                        time={lib.time}
                    />
                ))}
            </ul>
        </div>
    )
}

export default LibraryList;
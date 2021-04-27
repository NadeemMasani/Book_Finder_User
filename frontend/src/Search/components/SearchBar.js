import React from 'react';
import './SearchBar.css';

const SearchBar = ({ placeholder, onChange, value }) => {
    return (
        <input className="input"
            placeholder={placeholder}
            onChange={onChange}
            value={value}
        />
    )
}

export default SearchBar

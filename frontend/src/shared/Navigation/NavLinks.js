import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavLinks.css';

const NavLinks = props => {


  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          Search Books
        </NavLink>
      </li>
      <li>
        <NavLink to="/libraries" exact>
          Libraires
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;

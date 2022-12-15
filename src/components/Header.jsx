import React from 'react';
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <div className="logo">
        Manga4Up
      </div>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
        <Link to="/list">Manga List</Link>
      </div>
    </header>
  )
}


export default Header;

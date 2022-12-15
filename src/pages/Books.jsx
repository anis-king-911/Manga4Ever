import React from 'react';
import { Link } from "react-router-dom";

function Books() {
  const data = ['anis', 'aya'];
  
  return (
    <div>
      <h1> Books </h1>
      {
      data.map((item) => {
        return (
      <Link className="Books" to={item}>{item}</Link>
        )
      })
      }
    </div>
  )
};

export default Books;

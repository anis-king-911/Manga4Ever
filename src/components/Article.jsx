import React from 'react';
import { Link } from "react-router-dom";

function Article(data) {
  const {
    Title, Cover, Count, State, Type, CreationDate
  } = data.data;
  
  return (
    <article>
      <div className="Cover">
        <img src={Cover} alt={Title}/>
      </div>
      <div className="Info">
        <h2><Link to={`/manga/${Title.replaceAll(' ', '_')}`}>{Title}</Link></h2>
        <p>State <span>{State}</span></p>
        <p>Type <span>{Type}</span></p>
        <p>Volume Count <span>{Count}</span></p>
        <p>Created At <span>{CreationDate}</span></p>
      </div>
    </article>
    
  );
}

export default Article;
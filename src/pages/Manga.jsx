import React from 'react';
import { useParams } from "react-router-dom";

function Manga() {
  const { id } = useParams();
  
  return (
    <div>
      <h1> Manga { id.replaceAll('_', ' ') }</h1>
    </div>
  )
};

export default Manga;
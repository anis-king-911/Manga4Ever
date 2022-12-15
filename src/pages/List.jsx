import React from 'react';
import { Link } from "react-router-dom";

import {
  database, ref, child, onValue, list
} from '../scripts/firebase';

import Article from '../components/Article';

function List() {
  
  const [dataList, setDataList] = React.useState([]);
  
  React.useEffect(() => {
    
    const databaseRef = ref(database, list);
    
    onValue(databaseRef, (snapshot) => {
      snapshot.forEach((snap) => {
        const key = snap.key;
        const data = snap.val();
        
        setDataList((oldArray) => [...oldArray, data]);
      })
    })
    
  }, []);
  
  return (
    
    <div className="MangaContainer">
      {dataList.reverse().splice(0, 6).map(data => <Article data={data}/>)}
    </div>
    
  );
  
}


export default List;
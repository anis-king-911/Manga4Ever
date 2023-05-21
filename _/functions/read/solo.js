import {
  CoversList, order, size, database,
  ref, get, onValue, query, orderByChild,
  endAt, startAfter
} from 'firebase';

function SoloRead(MangaTable, { title, type }) {
  const databaseRef = ref(database, CoversList);
  const databaseOrd = query(databaseRef, orderByChild(order))
  
  onValue(databaseRef, async (snaps) => {
    MangaTable.innerHTML = '';
    
    const { VolumeRow } = await import('../components.js'); 
    const snapshot = Object.entries(snaps.val()).filter(([key, val]) => {
      return val['Title'] === title;
    }).filter(([key, val]) => {
      return val['Type'] === type;
    });
    
    snapshot.map(([key, data]) => MangaTable.innerHTML += VolumeRow(key, data));
  })
}

export { SoloRead }
import {
  MainList, order, size, database,
  ref, get, onValue, query, orderByChild,
  endAt, startAfter
} from 'firebase';

let allMangaPages = [], newSize = 15;

async function MangaRead(MangaTable, PageIndex, lmpMangaBtn) {
  const databaseRef = ref(database, MainList);
  const databaseOrd = query(databaseRef, orderByChild(order));
  const { MangaRow } = await import('../components.js');
  
  onValue(databaseOrd, (snaps) => {
    const snapshot = Object.entries(snaps.val());
    const databaseSize = snapshot.length;
    const databasePages = Math.ceil(databaseSize / newSize);
    
    for (let index = 0; index < databasePages; index++) {
      allMangaPages.push(snapshot.slice((index*newSize), ((index+1)*newSize)).reverse());
    }
    
    allMangaPages.reverse();
    allMangaPages[PageIndex - 1].map(( [key, data] ) => MangaTable.innerHTML += MangaRow(key, data) );
    
    lmpMangaBtn.addEventListener('click', () => {
      PageIndex = PageIndex +1;
      
      allMangaPages[PageIndex - 1].map(( [key, data] ) => MangaTable.innerHTML += MangaRow(key, data) );
      //MangaRead(MangaTable, (MangaPageIndex++)+1)
    });
  })
}

export { MangaRead }
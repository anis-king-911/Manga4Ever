import {
  MainList, order, size, database,
  ref, get, onValue, query, orderByChild,
  endAt, startAfter
} from 'firebase';

let allMangaPages = [];

async function MangaRead(MangaTable, PageIndex) {
  const databaseRef = ref(database, MainList);
  const databaseOrd = query(databaseRef, orderByChild(order));
  const databaseSize = await get(databaseOrd).then(res => res.size);
  const databasePages = Math.ceil(databaseSize/size);

  for (let index = 0; index < databasePages; index++) {
    allMangaPages.push({
      from: Number( index * size ),
      to: Number( ( index + 1 ) * size )
    })
  }

  const databaseStr = query(databaseOrd, startAfter(allMangaPages[PageIndex - 1].from));
  const databaseEnd = query(databaseStr, endAt(allMangaPages[PageIndex - 1].to));

  onValue(databaseEnd, async (snaps) => {
    //MangaTable.innerHTML = '';
    const { MangaRow } = await import('../components.js');
    const snapshot = Object.entries(snaps.val());//.reverse();

    snapshot.map(( [key, data] ) => MangaTable.innerHTML = MangaRow(key, data) + MangaTable.innerHTML);
  })

  if(databasePages === PageIndex) document.querySelector('.lmp').remove();
}

export { MangaRead }
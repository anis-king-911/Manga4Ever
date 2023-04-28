import {
  MainList, CoversList, order, size,
  database, ref, child, onValue, set, get, push, update, remove,
  query, orderByChild, startAfter, endAt,
} from 'firebase';

let allVolumePages = [];

async function VolumeRead(VolumeTable, PageIndex, directionBtn) {
  //String(directionBtn.innerText).includes('new') ? PageIndex = (PageIndex++)+1 :
  //String(directionBtn.innerText).includes('old') ? PageIndex = (PageIndex--)-1 :
  //directionBtn == undefined ? PageIndex = PageIndex : '';
  
  const databaseRef = ref(database, CoversList);
  const databaseOrd = query(databaseRef, orderByChild(order));
  const databaseSize = await get(databaseOrd).then(res => res.size);
  const databasePages = Math.ceil(databaseSize/size);
  
  for (let index = 0; index < databasePages; index++) {
    allVolumePages.push({
      from: Number( index * size ),
      to: Number( ( index + 1 ) * size )
    })
  }
  
  PageIndex === 1 ? PageIndex = databasePages : 1;
  
  const databaseStr = query(databaseOrd, startAfter(allVolumePages[PageIndex - 1].from));
  const databaseEnd = query(databaseStr, endAt(allVolumePages[PageIndex - 1].to));

  onValue(databaseEnd, async (snaps) => {
    VolumeTable.innerHTML = '';
    const { VolumeRow } = await import('../components.js');
    const snapshot = Object.entries(snaps.val()).reverse();
  
    snapshot.map(([key, data]) => VolumeTable.innerHTML += VolumeRow(key, data));
  })
}

export { VolumeRead }
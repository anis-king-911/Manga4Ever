import {
  MainList, CoversList, order, database,
  ref, onValue, query, orderByChild
} from 'firebase';

function FormsID(MangaForm, VolumeForm) {
  const mangaRef = query(ref(database, MainList), orderByChild(order));
  onValue(mangaRef, (snaps) => {
    const newMangaID = Object.values(snaps.val()).pop()['ID'] + 1;
    MangaForm.setAttribute('id', newMangaID);
  })

  const volumeRef = query(ref(database, CoversList), orderByChild(order));
  onValue(volumeRef, (snaps) => {
    const newVolumeID = Object.values(snaps.val()).pop()['ID'] + 1;
    VolumeForm.setAttribute('id', newVolumeID);
  })
}

export { FormsID }
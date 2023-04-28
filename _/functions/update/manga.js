import { MainList, database, ref, child, update } from 'firebase';

function MangaUpdate(uid, props) {
  const databaseRef = ref(database, MainList);
  const databaseChild = child(databaseRef, `${uid}`);

  update(databaseChild, props)
    .then(() => window.close())
    .catch(error => console.log(error))
}

export { MangaUpdate }
import { MainList, database, ref, child, update } from 'firebase';

async function MangaUpdate(uid, props) {
  const databaseRef = ref(database, MainList);
  const databaseChild = child(databaseRef, `${uid}/`);

  update(databaseChild, props)
    .then(() => alert('done'))
    .catch(error => console.log(error))
}

export { MangaUpdate }
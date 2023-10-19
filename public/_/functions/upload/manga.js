import { MainList, database, ref, set, push } from 'firebase';

function MangaUpload(props) {
  const databaseRef = ref(database, MainList);
  const databasePush = push(databaseRef);

  set(databasePush, props)
    .then(() => console.log('manga upload done'))
    .catch(error => console.log(error))
}

export { MangaUpload }
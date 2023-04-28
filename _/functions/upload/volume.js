import { CoversList, database, ref, set, child } from 'firebase';

function VolumeUpload(props) {
  const databaseRef = ref(database, CoversList);
  const databaseChild = child(databaseRef, `${CreatedAt}/`);

  set(databaseChild, props)
    .then(() => console.log('volume upload done'))
    .catch(error => console.log(error))
}

export { VolumeUpload }
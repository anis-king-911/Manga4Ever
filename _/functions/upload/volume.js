import { CoversList, database, ref, set, child } from 'firebase';

function VolumeUpload(props) {
  const key = props['Dates']['CreAt'];
  const databaseRef = ref(database, CoversList);
  const databaseChild = child(databaseRef, `${key}/`);

  set(databaseChild, props)
    .then(() => console.log('volume upload done'))
    .catch(error => console.log(error))
}

export { VolumeUpload }
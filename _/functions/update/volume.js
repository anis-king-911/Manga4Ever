import { CoversList, database, ref, child, update } from 'firebase';

function VolumeUpdate(uid, props) {
  const databaseRef = ref(database, CoversList);
  const databaseChild = child(databaseRef, `${uid}`);

  update(databaseChild, props)
    .then(() => window.close())
    .catch(error => console.log(error))
}

export { VolumeUpdate }
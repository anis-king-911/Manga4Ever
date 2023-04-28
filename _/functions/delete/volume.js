import { CoversList, database, ref, child,remove } from 'firebase';

function VolumeDelete(key) {
  const question = confirm('Delete This Volume');

  if(question) {
    const databaseRef = ref(database, CoversList);
    const databaseChild = child(databaseRef, key);
    
    remove(databaseChild)
      .then(() => console.log('volume removed done'))
      .catch(error => console.log(error));
  } else {
    alert('operation canceld !');
  }
}

export { VolumeDelete }
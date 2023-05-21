import { MainList, database, ref, child,remove } from 'firebase';

function MangaDelete(key) {
  const question = confirm('delete this manga ?');

  if(question) {
    const databaseRef = ref(database, MainList);
    const databaseChild = child(databaseRef, key);
    
    remove(databaseChild)
      .then(() => console.log('manga removed done'))
      .catch(error => console.log(error));
  } else {
    alert('operation canceld !');
  }
}

export { MangaDelete }
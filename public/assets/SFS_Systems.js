function newSnapshot(array, _sort) {
  _sort.includes('asc') ?
    array = array.sort((a, b) => (
      a['Title'] < b['Title'] ? 1 :
      a['Title'] > b['Title'] ? -1 : 0
    )) :
    _sort.includes('desc') ?
    array = array.sort((a, b) => (
      a['Title'] < b['Title'] ? -1 :
      a['Title'] > b['Title'] ? 1 : 0
    )) :
    _sort.includes('pubat') ?
    array = array.sort((a, b) => (
      a['Dates']['PubAt'] - b['Dates']['PubAt']
    )) :
    '';

  return array;

  /*
  WindowSort.includes('asc') ?
    snapshot = snapshot.sort((a, b) => (
      a['Title'] < b['Title'] ? 1 :
      a['Title'] > b['Title'] ? -1 : 0
    ))
  : WindowSort.includes('desc') ?
    snapshot = snapshot.sort((a, b) => (
      a['Title'] < b['Title'] ? -1 :
      a['Title'] > b['Title'] ? 1 : 0
    ))
  : WindowSort.includes('pubat') ?
    snapshot = snapshot.sort((a, b) => (
      a['Dates']['PubAt'] - b['Dates']['PubAt']
    ))
  : '';
  */
}

let sortSnap;

function SFS_System(array, parameters) {
  // SFS_System = SearchFilterSort_Systems
  const { WindowState, WindowType, WindowSort /* , SearchedTitle */ } = parameters;

  // return 0, [];
  if (!WindowState && !WindowType && !WindowSort) {
    array = array;
  }

  // return 1, ['State'];
  if (WindowState && !WindowType && !WindowSort) {
    array = array.filter((item) => (
      item['State'].toLocaleLowerCase() === WindowState
    ));
  }

  // return 1, ['Type'];
  if (!WindowState && WindowType && !WindowSort) {
    array = array.filter((item) => (
      item['Type'].toLocaleLowerCase() === WindowType
    ));
  }

  // return 1, ['Sort'];
  if (!WindowState && !WindowType && WindowSort) {
    sortSnap = newSnapshot(array, WindowSort);
    array = sortSnap;
  }

  // return 2, ['State', 'Type'];
  if (WindowState && WindowType && !WindowSort) {
    array = array.filter((item) => (
      item['State'].toLocaleLowerCase() === WindowState
    )).filter((item) => (
      item['Type'].toLocaleLowerCase() === WindowType
    ));
  }

  // return 2, ['State', 'Sort'];
  if (WindowState && !WindowType && WindowSort) {
    sortSnap = newSnapshot(array, WindowSort);

    array = sortSnap.filter((item) => (
      item['State'].toLocaleLowerCase() === WindowState
    ));
  }

  // return 2, ['Type', 'Sort'];
  if (!WindowState && WindowType && WindowSort) {
    sortSnap = newSnapshot(array, WindowSort);

    array = sortSnap.filter((item) => (
      item['Type'].toLocaleLowerCase() === WindowType
    ));
  }

  // return 3, ['State', 'Type', 'Sort'];
  if (WindowState && WindowType && WindowSort) {
    sortSnap = newSnapshot(array, WindowSort);

    array = sortSnap.filter((item) => (
      item['State'].toLocaleLowerCase() === WindowState
    )).filter((item) => (
      item['Type'].toLocaleLowerCase() === WindowType
    ));
  }
  
  // return x, ignore all the previous only the search
  //if (SearchedTitle) {
  //  array = array.filter((item) => (
  //    item['Title'].toLocaleLowerCase().includes(SearchedTitle.toLocaleLowerCase()) ? item : null
  //  ));
  //}
  
  //console.log(array);
  return array.reverse();
}

export { SFS_System }

/*
async function getSearchedTitle(wanted) {
  const dataRef = ref(database, MainList);
  const { Manga } = await import('./components.js');

  onValue(dataRef, (snaps) => {
    Container.innerHTML = '';
    const snapshot = Object.values(snaps.val());
    const searched = snapshot.filter((item) => {
      return String(item['Title']).toLocaleLowerCase().match(String(wanted).toLocaleLowerCase())
    })

    innerData(searched, Manga);
    lmpBtn.disabled = true;
  })
}
*/

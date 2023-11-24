function newSnapshot(array, _sort, _dir) {
  _sort = _sort === null ? 'id' : _sort;
  _dir = _dir === null ? 'asc' : _dir;

  if (_sort.includes('title') && _dir.includes('asc')) {
    array = array.sort((a, b) => (
      a['Title'] < b['Title'] ? 1 :
        a['Title'] > b['Title'] ? -1 : 0
    ))
  } else if (_sort.includes('title') && _dir.includes('desc')) {
    array = array.sort((a, b) => (
      a['Title'] < b['Title'] ? -1 :
        a['Title'] > b['Title'] ? 1 : 0
    ))
  } else if (_sort.includes('pubat') && _dir.includes('asc')) {
    array = array.sort((a, b) => (
      a['Dates']['PubAt'] < b['Dates']['PubAt'] ? 1 :
        a['Dates']['PubAt'] > b['Dates']['PubAt'] ? -1 : 0
    ))
  } else if (_sort.includes('pubat') && _dir.includes('desc')) {
    array = array.sort((a, b) => (
      a['Dates']['PubAt'] < b['Dates']['PubAt'] ? -1 :
        a['Dates']['PubAt'] > b['Dates']['PubAt'] ? 1 : 0
    ))
  } else if (_sort.includes('id') && _dir.includes('asc')) {
    array = array.sort((a, b) => (
      a['ID'] < b['ID'] ? 1 :
        a['ID'] > b['ID'] ? -1 : 0
    ))
  } else if (_sort.includes('id') && _dir.includes('desc')) {
    array = array.sort((a, b) => (
      a['ID'] < b['ID'] ? -1 :
        a['ID'] > b['ID'] ? 1 : 0
    ))
  } else if (_sort.includes('volcount') && _dir.includes('asc')) {
    array = array.sort((a, b) => (
      a['VolCount'] < b['VolCount'] ? 1 :
        a['VolCount'] > b['VolCount'] ? -1 : 0
    ))
  } else if (_sort.includes('volcount') && _dir.includes('desc')) {
    array = array.sort((a, b) => (
      a['VolCount'] < b['VolCount'] ? -1 :
        a['VolCount'] > b['VolCount'] ? 1 : 0
    ))
  }
  return array;
}

let sortSnap;

function SFS_System(array, parameters) {
  const { WindowState, WindowType, WindowSort, WindowSortDir } = parameters;

  // return 0, [];
  if (!WindowState && !WindowType && (!WindowSort && !WindowSortDir)) {
    array = array;
  }

  // return 1, ['State'];
  if (WindowState && !WindowType && (!WindowSort && !WindowSortDir)) {
    array = array.filter((item) => (
      item['State'].toLocaleLowerCase() === WindowState
    ));
  }

  // return 1, ['Type'];
  if (!WindowState && WindowType && (!WindowSort && !WindowSortDir)) {
    array = array.filter((item) => (
      item['Type'].toLocaleLowerCase() === WindowType
    ));
  }

  // return 1, ['Sort'];

  // sorted data
  //const oneSort = (!WindowSort && !WindowSortDir); // both null
  const twoSort = (WindowSort && WindowSortDir); // buth true
  const thrSort = (WindowSort && !WindowSortDir); // one true one false
  const forSort = (!WindowSort && WindowSortDir); // one true one false
  const finalSort = (twoSort || thrSort || forSort);

  if (!WindowState && !WindowType && finalSort) {
    sortSnap = newSnapshot(array, WindowSort, WindowSortDir);
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
  if (WindowState && !WindowType && finalSort) {
    sortSnap = newSnapshot(array, WindowSort, WindowSortDir);

    array = sortSnap.filter((item) => (
      item['State'].toLocaleLowerCase() === WindowState
    ));
  }

  // return 2, ['Type', 'Sort'];
  if (!WindowState && WindowType && finalSort) {
    sortSnap = newSnapshot(array, WindowSort, WindowSortDir);

    array = sortSnap.filter((item) => (
      item['Type'].toLocaleLowerCase() === WindowType
    ));
  }

  // return 3, ['State', 'Type', 'Sort'];
  if (WindowState && WindowType && finalSort) {
    sortSnap = newSnapshot(array, WindowSort, WindowSortDir);

    array = sortSnap.filter((item) => (
      item['State'].toLocaleLowerCase() === WindowState
    )).filter((item) => (
      item['Type'].toLocaleLowerCase() === WindowType
    ));
  }

  return array.reverse();
}

export { SFS_System }
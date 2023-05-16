/**
 * 
 * futer updates
 *  - make the date at '/manga.html' a button to filter
 *  
 **/

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getDatabase, ref, onValue, query, orderByChild
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

const firebaseConfig = {
  databaseURL: "https://manga4ever-vercel-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const WindowPath = window.location.pathname;
const WindowSearch = window.location.search;
const WindowParams = new URLSearchParams(WindowSearch);
const WindowTitle = WindowParams.has('title') ? WindowParams.get('title').replaceAll('_', ' ') : null;
const WindowState = WindowParams.has('state') ? WindowParams.get('state').replaceAll('_', ' ').toLocaleLowerCase() : null;
const WindowType = WindowParams.has('type') ? WindowParams.get('type').replaceAll('_', ' ').toLocaleLowerCase() : null;
const WindowSort = WindowParams.has('sort') ? WindowParams.get('sort').replaceAll('_', ' ').toLocaleLowerCase() : null;

const Container = document.querySelector('.Container');
const SearchMe = document.querySelector('#SearchMe');
const allForms = document.querySelectorAll('form');
const lmpBtn = document.querySelector('.lmp button');
const opt = (item) => `<option value="${item}">${item}</option>`;

const SearchFilter = document.querySelector('.SearchFilter');
const loading = document.querySelector('.loading');

let MainList = 'MainList/', CoversList = 'CoversList/';
let order = 'ID', size = 15, allPages = [], wantedPage = 1;
let toInner, delayTimer, sortSnap;

allForms.forEach(form => form.addEventListener('submit', event => event.preventDefault()));

function SFS_System(array, parameters) {
  // SFS_System = SearchFilterSort_Systems
  const { WindowState, WindowType, WindowSort, SearchedTitle } = parameters;
  
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
  
  if(SearchedTitle) {
    array = array.filter((item) => (
      item['Title'].toLocaleLowerCase().match(SearchedTitle.toLocaleLowerCase())
    ));
  }
  
  return array;
}

async function gatMainList(pageIndex, parameters) {
  const dataRef = ref(database, MainList);
  const dataOrd = query(dataRef, orderByChild(order));
  const { Manga } = await import('./components.js');

  onValue(dataOrd, (snaps) => {
    Container.innerHTML = '';
    const sortedSnapshot = Object.values(snaps.val()).sort((a, b) => (a['ID'] - b['ID']));
    const snapshot = SFS_System(sortedSnapshot, parameters);
    const snapSize = snapshot.length;
    const snapPage = Math.ceil(snapSize / size);

    for (var index = 0; index < snapPage; index++) {
      allPages.push({
        from: Number(index * size),
        to: Number((index + 1) * size)
      });
    }

    allPages.reverse();
    toInner = snapshot.slice(allPages[pageIndex - 1].from, allPages[pageIndex - 1].to).reverse();
    innerData(toInner, Manga);

    lmpBtn.addEventListener('click', () => {
      pageIndex = pageIndex + 1;

      toInner = snapshot.slice(allPages[pageIndex - 1].from, allPages[pageIndex - 1].to).reverse();
      innerData(toInner, Manga);
      if (pageIndex === snapPage) lmpBtn.disabled = true; //lmpBtn.remove();
    });

    if (pageIndex === snapPage) lmpBtn.disabled = true; //lmpBtn.remove();

    console.log({ ...parameters, snapSize });
  });
}

async function getCoversList(name, type) {
  document.title = `${type} | ${name}`;
  const dataRef = ref(database, CoversList);
  const dataOrd = query(dataRef, orderByChild(order));
  const { Volume } = await import('./components.js');

  onValue(dataOrd, (snaps) => {
    Container.innerHTML = '';
    const snapshot = Object.values(snaps.val()).reverse();
    const filtered = snapshot.filter((item) => {
      return item['Title'] === name;
    }).filter((item) => {
      return item['Type'].toLocaleLowerCase() === type;
    });

    innerData(filtered, Volume)
  })
}
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
function getAvailableTitles() {
  SearchMe.innerHTML = '';
  const dataRef = ref(database, MainList);

  onValue(dataRef, (snaps) => {
    const snapchat = Object.values(snaps.val());
    const titles = snapchat.map(item => item['Title']);

    [...new Set(titles)].map(item => SearchMe.innerHTML += opt(item))
  })
}

function innerData(array, Compo) {
  array.map(item => Container.innerHTML += Compo(item));
}

function insertParam(key, value) {
  var searchParams = new URLSearchParams(window.location.search)
  searchParams.set(key, value)
  window.location.search = searchParams.toString()
}

function removeParam(key) {
  var searchParams = new URLSearchParams(window.location.search)
  searchParams.delete(key)
  window.location.search = searchParams.toString()
}

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

window.addEventListener('DOMContentLoaded', () => {

  let run = setInterval(() => {
    if (Container.childNodes.length) {
      loading.remove();
      clearInterval(run);
    }
  }, 100);

  if (WindowPath === '/' || WindowPath === '/index.html') {
    gatMainList(wantedPage, { WindowState, WindowType, WindowSort });
    getAvailableTitles();

    SearchFilter.querySelector('input').addEventListener('input', () => {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(() => {

        if (SearchFilter.querySelector('input').value === '') {
          gatMainList(wantedPage, { WindowState, WindowType, WindowSort });
          lmpBtn.disabled = false;
        } else {
          gatMainList(wantedPage, {
            SearchedTitle: SearchFilter.querySelector('input').value
          });
          //getSearchedTitle(SearchFilter.querySelector('input').value);
        }
      }, 2400);
    })

    SearchFilter.reset();
  } else if (WindowPath === '/manga.html') {
    getCoversList(WindowTitle, WindowType);
  }
});

window.insertParam = insertParam;
window.removeParam = removeParam;
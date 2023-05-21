/**
 * 
 * futer updates
 *  - make the date at '/manga.html' a button to filter
 *  
 **/

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getDatabase, ref, onValue, query, orderByChild
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

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
const _sort = (a, b) => (a['ID'] - b['ID']);

const SearchFilter = document.querySelector('.SearchFilter input');
const domLoading = document.querySelector('.domLoading');

let MainList = 'MainList/', CoversList = 'CoversList/';
let order = 'ID', size = 15, allPages = [], wantedPage = 1;
let delayTimer;

allForms.forEach(form => form.addEventListener('submit', event => event.preventDefault()));

async function gatMainList(pageIndex, parameters) {
  const dataRef = ref(database, MainList);
  const dataOrd = query(dataRef, orderByChild(order));
  const { SFS_System } = await import('./SFS_Systems.js');
  const { Manga } = await import('./components.js');

  onValue(dataOrd, (snaps) => {
    Container.innerHTML = '';
    const sortedSnapshot = Object.values(snaps.val()).sort(_sort);
    const snapshot = SFS_System(sortedSnapshot, parameters);
    const snapSize = snapshot.length;
    const snapPage = Math.ceil(snapSize / size);
    
    //allPages.splice(0, allPages.length);
    for (var index = 0; index < snapPage; index++) {
      allPages.push(snapshot.slice((index*size), ((index+1)*size)));
    }

    innerData(allPages[pageIndex - 1], Manga);

    lmpBtn.addEventListener('click', async () => {
      pageIndex = pageIndex + 1;
      
      await innerLoading();
      await innerData(allPages[pageIndex - 1], Manga);
      await removeLoading();
      if (Container.childElementCount === snapSize) lmpBtn.parentNode.remove();
    });
    
    if (Container.childElementCount === snapSize) lmpBtn.parentNode.remove();
    //console.log({ ...parameters, snapSize });
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
    const filtered = snapshot.filter((item) => (
      item['Title'] === name
    )).filter((item) => (
      item['Type'].toLocaleLowerCase() === type
    ));
    
    innerData(filtered, Volume)
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

function innerLoading() {
  lmpBtn.innerHTML = '<div class="btnLoading"></div>';
  setTimeout(() => lmpBtn.innerHTML = 'load more', 5000);
}

function removeLoading() {
  lmpBtn.innerHTML = 'load more';
}

function getAvailableTitles() {
  SearchMe.innerHTML = '';
  const dataRef = ref(database, MainList);

  onValue(dataRef, (snaps) => {
    const snapchat = Object.values(snaps.val());
    const titles = snapchat.map(item => item['Title']);

    [...new Set(titles)].map(item => SearchMe.innerHTML += opt(item))
  })
}

async function getSearchedTitles(argument) {
  const dataRef = ref(database, MainList);
  const dataOrd = query(dataRef, orderByChild(order));
  const { Manga } = await import('./components.js');
  //const { SFS_System } = await import('./SFS_Systems.js');
  
  onValue(dataOrd, (snaps) => {
    Container.innerHTML = '';
    const snapshot = Object.values(snaps.val()).sort(_sort).filter((item) => (
      item['Title'].toLocaleLowerCase().includes(argument.toLocaleLowerCase()) ? item : null
    ));
    //const snapshot = SFS_System(sortedSnapshot, parameters);
    const snapSize = snapshot.length;
    const snapPage = Math.ceil(snapSize / size);
  
    //allPages.splice(0, allPages.length);
    //for (var index = 0; index < snapPage; index++) {
    //  allPages.push(snapshot.slice((index * size), ((index + 1) * size)));
    //}
  
    innerData(snapshot, Manga);
    lmpBtn.parentNode.remove();
    //lmpBtn.addEventListener('click', async () => {
    //  pageIndex = pageIndex + 1;
    //
    //  await innerLoading();
    //  await innerData(allPages[pageIndex - 1], Manga);
    //  await removeLoading();
    //  if (Container.childElementCount === snapSize) lmpBtn.parentNode.remove();
    //});
  
    //if (Container.childElementCount === snapSize) lmpBtn.parentNode.remove();
    //console.log({ ...parameters, snapSize });
  });
}

window.addEventListener('DOMContentLoaded', () => {

  if (WindowPath === '/' || WindowPath === '/index.html') {
    gatMainList(wantedPage, { WindowState, WindowType, WindowSort });
    getAvailableTitles();

    SearchFilter.addEventListener('input', () => {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(() => {
        
        if (SearchFilter.value !== '') {
          getSearchedTitles(SearchFilter.value);
        } else {
          gatMainList(wantedPage, { WindowState, WindowType, WindowSort });
          lmpBtn.parentNode.innerHTML = `<button>load more</button>`;
        }
        
      }, 1000);
    });
    
  } else if (WindowPath === '/manga.html') {
    getCoversList(WindowTitle, WindowType);
  }
});

window.insertParam = insertParam;
window.removeParam = removeParam;
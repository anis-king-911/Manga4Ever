import { initializeApp } from "firebase-app";
import { getDatabase, ref, onValue, query, orderByChild } from "firebase-database";

const firebaseConfig = {
  //databaseURL: "https://manga4ever-vercel-default-rtdb.europe-west1.firebasedatabase.app",
  databaseURL: 'https://manga4ever-test-default-rtdb.europe-west1.firebasedatabase.app'
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const localStorageRef = 'Manga4Ever|SortingDirection';
const getSortingDirection = window.localStorage.getItem(localStorageRef);
const setSortingDirection = (dir) => window.localStorage.setItem(localStorageRef, dir);

const WindowPath = window.location.pathname;
const WindowSearch = window.location.search;
const WindowParams = new URLSearchParams(WindowSearch);

const WindowTitle = WindowParams.has('title') ? WindowParams.get('title').replaceAll('_', ' ') : null;
const WindowState = WindowParams.has('state') ? WindowParams.get('state').replaceAll('_', ' ').toLowerCase() : null;
const WindowType = WindowParams.has('type') ? WindowParams.get('type').replaceAll('_', ' ').toLowerCase() : null;
const WindowSort = WindowParams.has('sort') ? WindowParams.get('sort').replaceAll('_', ' ').toLowerCase() : null;
const WindowSortDir = WindowParams.has('sort-dir') ? WindowParams.get('sort-dir').toLowerCase() : null;

const Container = document.querySelector('.Container');
const SearchMe = document.querySelector('#SearchMe');
const allForms = document.querySelectorAll('form');
const lmpBtn = document.querySelector('.lmp button');

const opt = (item) => `<option value="${item}">${item}</option>`;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const SearchFilter = document.querySelector('.SearchFilter input');
const domLoading = document.querySelector('.domLoading');

let MainList = 'MainList/', CoversList = 'CoversList/';
let order = 'ID', size = 15, wantedPage = 1, allPages = [];
let delayTimer;

allForms.forEach(form => form.addEventListener('submit', event => event.preventDefault()));

async function gatMainList(pageIndex, parameters) {
  const dataRef = ref(database, MainList);
  const dataOrd = query(dataRef, orderByChild(order));
  const { SFS_System } = await import('./SFS_Systems.js');
  const { Manga } = await import('./components.js');

  onValue(dataOrd, (snaps) => {
    Container.innerHTML = '';
    const sortedSnapshot = Object.values(snaps.val());
    const snapshot = SFS_System(sortedSnapshot, parameters);
    const snapSize = snapshot.length;
    const snapPage = Math.ceil(snapSize / size);

    for (var index = 0; index < snapPage; index++) {
      allPages.push(snapshot.slice((index * size), ((index + 1) * size)));
    }

    innerData(allPages[pageIndex - 1], Manga);

    lmpBtn.addEventListener('click', async () => {
      pageIndex = pageIndex + 1;

      innerLoading();
      await sleep(1600);
      innerData(allPages[pageIndex - 1], Manga);
      removeLoading();
      if (Container.childElementCount === snapSize) lmpBtn.parentNode.remove();
    });

    if (Container.childElementCount === snapSize) lmpBtn.parentNode.remove();
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
      item['Type'].toLowerCase() === type
    ));

    innerData(filtered, Volume)
  })
}

async function getSearchedTitles(argument) {
  const dataRef = ref(database, MainList);
  const dataOrd = query(dataRef, orderByChild(order));
  const { Manga } = await import('./components.js');

  onValue(dataOrd, (snaps) => {
    Container.innerHTML = '';
    const snapshot = Object.values(snaps.val()).filter((item) => (
      item['Title'].toLowerCase().includes(argument.toLowerCase()) ? item : null
    ));

    innerData(snapshot, Manga);
    lmpBtn.parentNode.remove();
  });
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
  lmpBtn.disabled = true;
  lmpBtn.innerHTML = '<div class="btnLoading"></div>';
  setTimeout(() => lmpBtn.innerHTML = 'load more', 10000);
}

function removeLoading() {
  lmpBtn.disabled = false;
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

function getDirection(dir) {
  switch (dir) {
    case null:
      dir = 'asc';
      break;
    case 'asc':
      dir = 'desc';
      break;
    case 'desc':
      dir = 'asc';
      break;
  }

  return dir;
}

function setingSortingDirection() {
  setSortingDirection(getDirection(getSortingDirection));
  insertParam('sort-dir', getDirection(getSortingDirection));
}

window.addEventListener('DOMContentLoaded', () => {
  if (WindowPath === '/' || WindowPath === '/index.html') {
    gatMainList(wantedPage, { WindowState, WindowType, WindowSort, WindowSortDir });
    getAvailableTitles();

    SearchFilter.addEventListener('input', () => {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(() => {

        if (SearchFilter.value !== '') {
          getSearchedTitles(SearchFilter.value);
        } else {
          gatMainList(wantedPage, { WindowState, WindowType, WindowSort, WindowSortDir });
          lmpBtn.parentNode.innerHTML = `<button>load more</button>`;
        }

      }, 1000);
    });

    const SortState = ['ID', 'Title', 'PubAt', 'VolCount'];
    document.querySelector('.SortingFilter').innerHTML += SortState.map(item => `
      <a href="javascript: insertParam('sort', '${item}')">by ${item}</a>
    `).join('');

  } else if (WindowPath === '/manga.html') {
    getCoversList(WindowTitle, WindowType);
  }
});

window.insertParam = insertParam;
window.removeParam = removeParam;
window.setingSortingDirection = setingSortingDirection;
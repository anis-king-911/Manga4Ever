/***
*
* futer updates
*  - make the date at '/manga.html' a button to filter
*  - download button with the expand button
*  - put them all in one container
*  - hover effect for the buttons to show down
*
***/

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

const Container = document.querySelector('.Container');
const lmpBtn = document.querySelector('.lmp button');
const SearchMe = document.querySelector('#SearchMe');
const allForms = document.querySelectorAll('form');
const opt = (item) => `<option value="${item}">${item}</option>`;

const SearchFilter = document.querySelector('.SearchFilter');

let MainList = 'MainList/', CoversList = 'CoversList/';
let order = 'ID', size = 15, allPages = [], wantedPage = 1;
let toInner, delayTimer;

allForms.forEach(form => form.addEventListener('submit', event => event.preventDefault()));

async function gatMainList(pageIndex, parameters) {
  const dataRef = ref(database, MainList);
  const dataOrd = query(dataRef, orderByChild(order));
  const { Manga } = await import('./components.js');
  
  onValue(dataOrd, (snaps) => {
    Container.innerHTML = '';
    const { WindowState, WindowType } = parameters;
    let snapshot = Object.values(snaps.val());
    
    if (!WindowState && !WindowType) {
      snapshot = snapshot;
    }
    
    if(!WindowState && WindowType) {
      snapshot = snapshot.filter((item) => {
        return item['Type'].toLocaleLowerCase() === WindowType;
      });
    }
    
    if(WindowState && !WindowType) {
      snapshot = snapshot.filter((item) => {
        return item['State'].toLocaleLowerCase() === WindowState;
      });
    }
    
    if (WindowState && WindowType) {
      snapshot = snapshot.filter((item) => {
        return item['State'].toLocaleLowerCase() === WindowState;
      }).filter((item) => {
        return item['Type'].toLocaleLowerCase() === WindowType;
      });
    }
    
    const snapSize = snapshot.length;
    const snapPage = Math.ceil(snapSize / size);
    
    for (var index = 0; index < snapPage; index++) {
      allPages.push({
        from: Number( index*size ),
        to: Number( (index+1)*size )
      });
    }
    
    allPages.reverse();
    toInner = snapshot.slice(allPages[pageIndex - 1].from, allPages[pageIndex - 1].to).reverse();
    innerData(toInner, Manga);
    
    lmpBtn.addEventListener('click', () => {
      pageIndex = pageIndex + 1;
      
      toInner = snapshot.slice(allPages[pageIndex - 1].from, allPages[pageIndex - 1].to).reverse();
      innerData(toInner, Manga);
      if(pageIndex === snapPage) lmpBtn.remove();
    })
    
    if(pageIndex === snapPage) lmpBtn.remove();
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

async function getSearchedTitle(wanted) {
  const dataRef = ref(database, MainList);
  const { Manga } = await import('./components.js');
  
  onValue(dataRef, (snaps) => {
    Container.innerHTML = '';
    const snapshot = Object.values(snaps.val());
    const searched = snapshot.filter((item) => {
      return String(item['Title']).toLocaleLowerCase().match(String(wanted).toLocaleLowerCase())
    })
    
    //console.log(searched);
    innerData(searched, Manga);
    lmpBtn.remove();
  })
}

function getAvailableTitles() {
  SearchMe.innerHTML = '';
  const dataRef = ref(database, MainList);
  
  onValue(dataRef, (snaps) => {
    const snapchat = Object.values(snaps.val());
    const titles = snapchat.map(item => item['Title']);
    
    [... new Set(titles)].map(item => SearchMe.innerHTML += opt(item))
  })
}

function innerData(array, Compo) {
  //console.log(WindowSearch);
  array.map(item => Container.innerHTML += Compo(item));
}

function insertParam(key, value) {
  var searchParams = new URLSearchParams(window.location.search)
  searchParams.set(key, value)
  window.location.search = searchParams.toString()
}

window.addEventListener('DOMContentLoaded', () => {
  if(WindowPath === '/' || WindowPath === '/index.html') {
    gatMainList(wantedPage, { WindowState, WindowType });
    getAvailableTitles();

    SearchFilter.querySelector('input').addEventListener('keyup', () => {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(() => {
        
        if(SearchFilter.querySelector('input').value === '') {
          gatMainList(wantedPage, { WindowState, WindowType});
        } else {
          getSearchedTitle(SearchFilter.querySelector('input').value);
        }
      }, 2400);
    })
    
    SearchFilter.reset();
  } else if(WindowPath === '/manga.html') {
    getCoversList(WindowTitle, WindowType);
  }
});

window.insertParam = insertParam;
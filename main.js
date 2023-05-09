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
const WindowType = WindowParams.has('type') ? WindowParams.get('type').replaceAll('_', ' ') : null;

const Container = document.querySelector('.Container');
const lmpBtn = document.querySelector('.lmp button');
const allForms = document.querySelectorAll('form');

let MainList = 'MainList/', CoversList = 'CoversList/';
let order = 'ID', size = 15, allPages = [], wantedPage = 1;
let toInner;

allForms.forEach(form => form.addEventListener('submit', event => event.preventDefault()));

async function gatMainList(pageIndex) {
  const dataRef = ref(database, MainList);
  const dataOrd = query(dataRef, orderByChild(order));
  const { Manga } = await import('./components.js');
  
  onValue(dataOrd, (snaps) => {
    const snapSize = snaps.size;
    const snapPage = Math.ceil(snapSize / size);
    const snapshot = Object.values(snaps.val());
    
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
    })
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
      return item['Type'] === type;
    });
    
    innerData(filtered, Volume)
  })
}

function innerData(array, Compo) {
  array.map(item => Container.innerHTML += Compo(item));
}

window.addEventListener('DOMContentLoaded', () => {
  if(WindowPath === '/' || WindowPath === '/index.html') {
    gatMainList(wantedPage);
  } else if(WindowPath === '/manga.html') {
    getCoversList(WindowTitle, WindowType);
  }
})
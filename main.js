/**
*
* future updates
* 1. change sorting & filtering systems
* 2. change the design UI
* 3. add LMP ( load more pagination )
*
*/

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getDatabase, ref, onValue, get, query, orderByChild, startAfter, endAt
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

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
let order = 'ID', size = 6, allPages = [], wantedPage = 1;

allForms.forEach(form => form.addEventListener('submit', event => event.preventDefault()));

async function gatMainList(pageIndex) {
  const dataRef = ref(database, MainList);
  const dataOrd = query(dataRef, orderByChild(order));
  const dataSize = await get(dataOrd).then(res => res.size);
  const dataPages = Math.ceil(dataSize/size);
  
  for (var index = 0; index < dataPages; index++) {
    allPages.push({
      from: Number(index*size),
      to: Number((index+1)*size)
    })
  }
  
  let reversedPages = allPages.reverse();
  const dataStr = query(dataOrd, startAfter(reversedPages[pageIndex - 1].from));
  const dataEnd = query(dataStr, endAt(reversedPages[pageIndex - 1].to));
  
  onValue(dataEnd, async (snaps) => {
    const { Manga } = await import('./components.js');
    const snapshot = Object.values(snaps.val()).reverse();
    
    snapshot.map(data => Container.innerHTML += Manga(data))
  })
}

function getCoversList(name, type) {
  document.title = `${type} | ${name}`
  const dataRef = ref(database, CoversList);
  const dataOrd = query(dataRef, orderByChild(order));
  
  onValue(dataOrd, async (snaps) => {
    Container.innerHTML = '';
    const { Volume } = await import('./components.js');
    const snapshot = Object.values(snaps.val()).reverse();
    const filtered = snapshot.filter((item) => {
      return item['Title'] === name;
    }).filter((item) => {
      return item['Type'] === type;
    });
    
    filtered.map(data => Container.innerHTML += Volume(data))
  })
}

window.addEventListener('DOMContentLoaded', () => {
  if(WindowPath === '/' || WindowPath === '/index.html') {
    gatMainList(wantedPage);
    
    lmpBtn.addEventListener('click', () => gatMainList((wantedPage++)+1))
  } else if(WindowPath === '/manga.html') {
    getCoversList(WindowTitle, WindowType);
  }
})
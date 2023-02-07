/*
const firebaseVersion = '9.15.0';

const firebaseConfig = {
  databaseURL: "https://manga4ever-vercel-default-rtdb.europe-west1.firebasedatabase.app",
};

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase, ref, child, onValue, get,
  query, orderByChild, endBefore, startAfter,
  limitToFirst, limitToLast, endAt, startAt
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let Manga4Up = 'Manga4Up/', List = 'List/', order = 'ID', size = 4, pageIndex = 1;
let firstKey = null, lastKey = null, firstChild = null, lastChild = null;
const Container = document.querySelector('.Container');
const PagesCount = document.querySelector('.PagesCount');
const newDataBtn = document.querySelector('.newData');
const oldDataBtn = document.querySelector('.oldData');

const nppBtns = document.querySelector('.npp-btns');

function Article({ ID, Title, Cover, Count, Type, State }) {
  return `
<article>
  <div class="ID">${ID.toLocaleString('en-US',{minimumIntegerDigits: 2})}</div>
  <div class="Cover">
    <img src="${Cover}" alt="${Title}"/> 
  </div>
  <div class="Info">
    <p class="Title">${Title}: ${Count}</p>
    <p>Type: <span>${Type}</span></p>
    <p>State: <span>${State}</span></p>
  </div>
</article>
  `;
}

async function Keys() {
  const databaseOrder = await query(ref(database, List), orderByChild(order));
  const snaps = await get(databaseOrder).then(snapshot => snapshot.val());
  const data = Object.values(snaps);
  
  firstChild = data.shift().ID;
  lastChild = data.pop().ID;
  
  console.log({ firstChild, lastChild });
  
  const xSize = await get(databaseOrder).then(snapshot => snapshot.size);
  
  /* 
  * if i have 59 item divided by 4 items each page
  * with Math.floor() it will be 14
  * with Math.floor()+1 it will be 15
  * with Math.ceil() it will be 15
  *
  *
  *
  ***
  
  console.log({
    xSize: xSize/size,
    mathFloor: Math.floor(xSize/size),
    plusOne: Math.floor(xSize/size)+1,
    mathCeil: Math.ceil(xSize/size)
  });
  
  for (var i = 0; i < Math.ceil(xSize/size); i++) {
    nppBtns.innerHTML += `<button page="${i+1}" from="${size*i}" to="${size*Number(i+1)}">${Number(i+1).toLocaleString('en-US', {minimumIntegerDigits: 2})}</button>`;
  }
  
  numbersPagination();
}

async function disabledBtns() {
  lastChild === lastKey ? newDataBtn.disabled = true : newDataBtn.disabled = false;
  firstChild === firstKey ? oldDataBtn.disabled = true : oldDataBtn.disabled = false;
  
  const databaseOrder = await query(ref(database, List), orderByChild(order));
  const totlaItems = await get(databaseOrder).then(snapshot => snapshot.size);
  const totalPages = await Math.ceil(totlaItems/size);
  PagesCount.innerHTML = `Page ${pageIndex.toLocaleString('en-US', {minimumIntegerDigits: 2})}/${totalPages}`;
}

let run = setInterval(() => {
  
  if(firstChild !== null && lastChild !== null) {
    disabledBtns();
    clearInterval(run);
  }
  
}, 100);

async function GetData(Container) {
  const databaseRef = await ref(database, List);
  const databaseOrder = await query(databaseRef, orderByChild(order));
  const databaseLimit = await query(databaseOrder, limitToFirst(size));
  
  onValue(databaseLimit, (snapshot)=> {
    Container.innerHTML = '';
    
    Object.values(snapshot.val()).map(data => Container.innerHTML += Article(data));
    
    firstKey = Object.values(snapshot.val()).shift().ID;
    lastKey = Object.values(snapshot.val()).pop().ID;
    
    disabledBtns();
  })
  
  await Keys();
}

async function newData(Container) {
  await pageIndex++;
  const databaseRef = await ref(database, List);
  const databaseOrder = await query(databaseRef, orderByChild(order));
  const databaseStart = await query(databaseOrder, startAfter(lastKey));
  const databaseLimit = await query(databaseStart, limitToFirst(size));

  onValue(databaseLimit, (snapshot)=> {
    Container.innerHTML = '';
    
    Object.values(snapshot.val()).map(data => Container.innerHTML += Article(data));
    
    firstKey = Object.values(snapshot.val()).shift().ID;
    lastKey = Object.values(snapshot.val()).pop().ID;
    
    disabledBtns();
  })
  const buttons = document.querySelectorAll('.npp-btns button');
  buttons.forEach(btn => btn.classList.remove('active'));
  buttons[pageIndex-1].classList.add('active');
}
async function oldData(Container) {
  await pageIndex--;
  const databaseRef = await ref(database, List);
  const databaseOrder = await query(databaseRef, orderByChild(order));
  const databaseStart = await query(databaseOrder, endBefore(firstKey));
  const databaseLimit = await query(databaseStart, limitToLast(size));
  
  onValue(databaseLimit, (snapshot) => {
    Container.innerHTML = '';
    
    Object.values(snapshot.val()).map(data => Container.innerHTML += Article(data));
    
    firstKey = Object.values(snapshot.val()).shift().ID;
    lastKey = Object.values(snapshot.val()).pop().ID;
    
    disabledBtns();
  })
  const buttons = document.querySelectorAll('.npp-btns button');
  buttons.forEach(btn => btn.classList.remove('active'));
  buttons[pageIndex-1].classList.add('active');
}

async function GetWantedData(fromWantedKey, toWantedKey, pageNumber) {
  pageIndex = pageNumber;
  const databaseRef = await ref(database, List);
  const databaseOrder = await query(databaseRef, orderByChild(order));
  const databaseStart = await query(databaseOrder, startAfter(fromWantedKey));
  const databaseEnd = await query(databaseStart, endAt(toWantedKey));
  const databaseLimit = await query(databaseEnd, limitToLast(size));
  
  onValue(databaseLimit, (snapshot) => {
    Container.innerHTML = '';
    
    Object.values(snapshot.val()).map(data => Container.innerHTML += Article(data));
  
    firstKey = Object.values(snapshot.val()).shift().ID;
    lastKey = Object.values(snapshot.val()).pop().ID;
  
    disabledBtns();
  })
}

async function numbersPagination() {
  const buttons = document.querySelectorAll('.npp-btns button');
  
  buttons[0].classList.add('active')
  buttons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      buttons.forEach(btn => btn.classList.remove('active'))
      btn.classList.add('active');
      const newPageIndex = Number(btn.getAttribute('page'));
      const from = Number(btn.getAttribute('from'));
      const to = Number(btn.getAttribute('to'));
      
      GetWantedData(from, to, newPageIndex);
    })
  })
}

newDataBtn.addEventListener('click', () => newData(Container));
oldDataBtn.addEventListener('click', () => oldData(Container));

window.onload = () => GetData(Container);

let load = setInterval(() => {
  if (Container.childNodes.length !== 0) {
    document.querySelector('.loader');
    clearInterval(load);
  }
}, 100);

*/
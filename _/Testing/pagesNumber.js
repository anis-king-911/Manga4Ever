import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase, ref, onValue, get, query,
  orderByChild, limitToFirst, limitToLast,
  startAfter, endAt, endBefore,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  databaseURL: "https://manga4ever-vercel-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const Container = document.querySelector('.Container');
const PagesCount = document.querySelector('.PagesCount');
const nppBtns = document.querySelector('.NPP-Btns');
const newDataBtn = document.querySelector('.newData');
const oldDataBtn = document.querySelector('.oldData');

let reference = 'Manga4Ever/', order = 'ID', size = 8, pageIndex = 1;
let firstKey = null, lastKey = null, firstChild = null, lastChild = null;

function Cover(src, alt) {
  return `<img src="${src}" alt="${alt}" />`;
}

function NumberBtn(i, s) {
  return `<button page="${i+1}" from="${s*i}" to="${s*Number(i+1)}">${Number(i+1).toLocaleString('en-US', {minimumIntegerDigits: 2})}</button>`;
}

async function Keys() {
  const databaseOrder = await query(ref(database, reference), orderByChild(order));
  const snaps = await get(databaseOrder).then(snapshot => snapshot.val());
  const data = Object.values(snaps);
  
  firstChild = data.shift().ID;
  lastChild = data.pop().ID;
  
  console.log({ firstChild, lastChild });
  
  const xSize = await get(databaseOrder).then(snapshot => snapshot.size);
  
  for (var i = 0; i < Math.ceil(xSize/size); i++) {
    nppBtns.innerHTML += NumberBtn(i, size);
  }
  
  numbersPagination();
}

async function disabledBtns() {
  lastChild === lastKey ? newDataBtn.disabled = true : newDataBtn.disabled = false;
  firstChild === firstKey ? oldDataBtn.disabled = true : oldDataBtn.disabled = false;
  
  const databaseOrder = await query(ref(database, reference), orderByChild(order));
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

async function GetData() {
  const databaseRef = await ref(database, reference);
  const databaseOrder = await query(databaseRef, orderByChild(order));
  const databaseLimit = await query(databaseOrder, limitToFirst(size));
  
  onValue(databaseLimit, (snapshot)=> {
    Container.innerHTML = '';
    
    Object.values(snapshot.val()).map(data => Container.innerHTML += Cover(data.Cover, data.Title));
    
    firstKey = Object.values(snapshot.val()).shift().ID;
    lastKey = Object.values(snapshot.val()).pop().ID;
    
    disabledBtns();
  })
  
  await Keys();
}

async function newData() {
  await pageIndex++;
  const databaseRef = await ref(database, reference);
  const databaseOrder = await query(databaseRef, orderByChild(order));
  const databaseStart = await query(databaseOrder, startAfter(lastKey));
  const databaseLimit = await query(databaseStart, limitToFirst(size));

  onValue(databaseLimit, (snapshot)=> {
    Container.innerHTML = '';
    
    Object.values(snapshot.val()).map(data => Container.innerHTML += Cover(data.Cover, data.Title));
    
    firstKey = Object.values(snapshot.val()).shift().ID;
    lastKey = Object.values(snapshot.val()).pop().ID;
    
    disabledBtns();
  })

  const buttons = document.querySelectorAll('.NPP-Btns button');
  buttons.forEach(btn => btn.classList.remove('active'));
  buttons[pageIndex-1].classList.add('active');
}

async function oldData() {
  await pageIndex--;
  const databaseRef = await ref(database, reference);
  const databaseOrder = await query(databaseRef, orderByChild(order));
  const databaseStart = await query(databaseOrder, endBefore(firstKey));
  const databaseLimit = await query(databaseStart, limitToLast(size));
  
  onValue(databaseLimit, (snapshot) => {
    Container.innerHTML = '';
    
    Object.values(snapshot.val()).map(data => Container.innerHTML += Cover(data.Cover, data.Title));
    
    firstKey = Object.values(snapshot.val()).shift().ID;
    lastKey = Object.values(snapshot.val()).pop().ID;
    
    disabledBtns();
  })

  const buttons = document.querySelectorAll('.NPP-Btns button');
  buttons.forEach(btn => btn.classList.remove('active'));
  buttons[pageIndex-1].classList.add('active');
}

async function GetWantedData(fromWantedKey, toWantedKey, pageNumber) {
  pageIndex = pageNumber;
  const databaseRef = await ref(database, reference);
  const databaseOrder = await query(databaseRef, orderByChild(order));
  const databaseStart = await query(databaseOrder, startAfter(fromWantedKey));
  const databaseEnd = await query(databaseStart, endAt(toWantedKey));
  const databaseLimit = await query(databaseEnd, limitToLast(size));
  
  onValue(databaseLimit, (snapshot) => {
    Container.innerHTML = '';
    
    Object.values(snapshot.val()).map(data => Container.innerHTML += Cover(data.Cover, data.Title));
  
    firstKey = Object.values(snapshot.val()).shift().ID;
    lastKey = Object.values(snapshot.val()).pop().ID;
  
    disabledBtns();
  })
}

async function numbersPagination() {
  const buttons = document.querySelectorAll('.NPP-Btns button');
  
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

newDataBtn.addEventListener('click', () => newData());
oldDataBtn.addEventListener('click', () => oldData());

window.addEventListener('DOMContentLoaded', () => GetData());
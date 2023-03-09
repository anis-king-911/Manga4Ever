import { listRow, referenceRow, numberBtn } from './components.js';

import {
  database, ref, child, onValue, set, get, push, update, remove,
  query, orderByChild, limitToLast, limitToFirst, startAfter, endBefore, endAt,
  reference, list
} from './firebase.js';

const WindowPATH = window.location.pathname;
const WindowREF = window.location.href.split('/').pop().split('?').shift();
const WindowPARAMS = new URLSearchParams(window.location.href.split('?').pop());

const forms = document.querySelectorAll('form');
const MangaForm = document.querySelector('.MangaForm');
const VolumeForm = document.querySelector('.VolumeForm');
const MangaUpdateForm = document.querySelector('.MangaUpdateForm');
const VolumeUpdateForm = document.querySelector('.VolumeUpdateForm');

const listTbody = document.querySelector('.listTbody');
const mangaTbody = document.querySelector('.mangaTbody');
const referenceTbody = document.querySelector('.referenceTbody');

let referenceOrder = 'ID', size = 10, pageIndex = 1;
let firstKey = null, lastKey = null, firstChild = null, lastChild = null;
let idDirection = true;

const getOldDataBtn = document.querySelector('.NewDataBtn');
const getNewDataBtn = document.querySelector('.OldDataBtn');
const PagesCount = document.querySelector('.PagesCount');
const PagesNumber = document.querySelector('.PagesNumber');

const SearchFilter = document.querySelector('.SearchFilter');
const StateFilter = document.querySelector('.StateFilter');
const StateFilterBtns = StateFilter?.querySelectorAll('button');
const SortingFilter = document.querySelector('.SortingFilter');
const SortingFilterBtns = SortingFilter?.querySelectorAll('button');

forms.forEach(form => form.addEventListener('submit', event => event.preventDefault()));

async function FormsID() {
  const listDatabaseRef = await query(ref(database, list), orderByChild('ID'));
  const listSnaps = await get(listDatabaseRef).then(snapshot => Object.values(snapshot.val()).pop().ID);
  const listNewID = await listSnaps + 1;
  MangaForm.setAttribute('id', listNewID);

  const referenceDatabaseRef = await query(ref(database, reference), orderByChild('ID'));
  const referenceSnaps = await get(referenceDatabaseRef).then(snapshot => Object.values(snapshot.val()).pop().ID);
  const referenceNewID = await referenceSnaps + 1;
  VolumeForm.setAttribute('id', referenceNewID);
  
  //console.log({listNewID, referenceNewID});
}

function MangaUpload({ ID, Title, Cover, Count, State, Type, Time, CreationDate }) {
  const databaseRef = ref(database, list);
  const databasePush = push(databaseRef);

  set(databasePush, {
    ID, Title, Cover, Count, State, Type, Time, CreationDate
  }).then( async () => {
    await FormsID();
    console.log('upload done');
    MangaForm.reset();
  }).catch(error => console.log(error))
}

function VolumeUpload({ ID, Title, VolNumber, Cover, Type, CreatedAt }) {
  const databaseRef = ref(database, reference);
  const databaseChild = child(databaseRef, `${CreatedAt}/`);

  set(databaseChild, {
    ID, Title, 'Number': VolNumber, Cover, Type, CreatedAt
  }).then( async () => {
    await FormsID();
    console.log('upload done');
    VolumeForm.reset();
    await Keys();
  }).catch(error => console.log(error))
}

function MangaUpdate(uid, { Title, Cover, Count, State, Type, CreationDate }) {
  const databaseRef = ref(database, list);
  const databaseChild = child(databaseRef, `${uid}`);

  update(databaseChild, {
    Title, Cover, Count, State, Type, CreationDate
  }).then(() => {
    console.log('Manga update done');
    MangaUpdateForm.reset();
    
    window.close();
  }).catch(error => console.log(error))
}

function VolumeUpdate(uid, { Title, Cover, VolNumber, Type }) {
  const databaseRef = ref(database, reference);
  const databaseChild = child(databaseRef, `${uid}`);

  update(databaseChild, {
    Title, Cover, 'Number': VolNumber, Type
  }).then(() => {
    console.log('Volume update done');
    MangaUpdateForm.reset();
    Keys
    
    window.close();
  }).catch(error => console.log(error))
}

function MangaRemove(key) {
  const que = confirm('Delete This Manga');

  switch (que) {
    case true:
      const databaseRef = ref(database, list);
      const databaseChild = child(databaseRef, key);

      remove(databaseChild).then( async () => {
        console.log(`Manga Removed done`);
        await FormsID();
      }).catch(error => console.log(error));
      break;
    case false:
      alert('Operation Canceld !');
      break;
  }
}

function VolumeRemove(key) {
  const que = confirm('Delete This Volume');

  switch (que) {
    case true:
      const databaseRef = ref(database, reference);
      const databaseChild = child(databaseRef, key);

      remove(databaseChild).then( async () => {
        console.log(`Volume Removed done`);
        await FormsID();
        await Keys();        
      }).catch(error => console.log(error));
      break;
    case false:
      alert('Operation Canceld !');
      break;
  }
}

async function OpenMangaEdit(form, id) {
  const databaseRef = await ref(database, list);
  const databaseChild = await child(databaseRef, `${id}/`);
  
  await onValue(databaseChild, (snapshot)=> {
    const key = snapshot.key;
    const data = snapshot.val();
    
    form.Title.value = data.Title;
    form.Count.value = data.Count;
    form.State.value = data.State;
    form.Cover.value = data.Cover;
    form.Type.value = data.Type;
    form.CreationDate.value = new Date(data.CreationDate).toISOString().split('Z').shift();
  })
}

async function OpenVolumeEdit(form, id) {
  const databaseRef = await ref(database, reference);
  const databaseChild = await child(databaseRef, `${id}/`);
  
  await onValue(databaseChild, (snapshot)=> {
    const key = snapshot.key;
    const data = snapshot.val();
    
    form.Title.value = data.Title;
    form.VolNumber.value = data.Number;
    form.Cover.value = data.Cover;
    form.Type.value = data.Type;
  })
}

async function Keys() {
  pageIndex = 1;
  const databaseOrder = await query(ref(database, reference), orderByChild(referenceOrder));
  const snap = await get(databaseOrder).then(snapshot => snapshot.val());
  const data = Object.values(snap);

  firstChild = data.shift().ID;
  lastChild = data.pop().ID;

  const DataSize = await get(databaseOrder).then(snapshot => snapshot.size);

  /*
  for (var i = 0; i < Math.ceil(DataSize / size); i++) {
    PagesNumber.innerHTML += numberBtn(i, size);
  }
  */

  pageIndex = Math.ceil(DataSize/size);

  await disabledBtns();
  //await numbersPagination();
}

async function disabledBtns() {
  lastChild === lastKey ? getOldDataBtn.disabled = true : getOldDataBtn.disabled = false;
  firstChild === firstKey ? getNewDataBtn.disabled = true : getNewDataBtn.disabled = false;

  const databaseOrder = await query(ref(database, reference), orderByChild(referenceOrder));
  const xSize = await get(databaseOrder).then(snapshot => snapshot.size);
  PagesCount.innerHTML = `page ${pageIndex}/${Math.ceil(xSize/size)}`;
}

let run = setInterval(() => {

  if (firstChild !== null && lastChild !== null) {
    disabledBtns();
    clearInterval(run);
  }

}, 100);


function getList() {
  const databaseRef = ref(database, list);

  onValue(databaseRef, async (snapshot) => {
    listTbody.innerHTML = '';

    Object.entries(snapshot.val()).reverse().map(( [key, data] ) => listTbody.innerHTML += listRow(key, data));
  })
}

async function getManga(title, type) {
  const databaseRef = ref(database, reference);
  
  onValue(databaseRef, async (snapshot) => {
    mangaTbody.innerHTML = '';
    
    const Snaps = Object.entries(snapshot.val());
    const titleFilter = Snaps.filter(( [key, item] ) => item['Title'] === title.replaceAll('_', ' '));
    const typeFilter = titleFilter.filter(( [key, item] ) => item['Type'] === type.replaceAll('_', ' '));
    
    typeFilter.reverse().map(( [key, data] ) => mangaTbody.innerHTML += referenceRow(key, data));
  })
}

async function getData() {
  const databaseRef = await ref(database, reference);
  const databaseOrder = await query(databaseRef, orderByChild(referenceOrder));
  const databaseLimit = await query(databaseOrder, limitToLast(size));

  await onValue(databaseLimit, (snapshot) => {
    referenceTbody.innerHTML = '';

    Object.entries(snapshot.val()).reverse().map(( [key, data] ) => referenceTbody.innerHTML += referenceRow(key, data));

    firstKey = Object.values(snapshot.val()).shift().ID;
    lastKey = Object.values(snapshot.val()).pop().ID;

    Keys();
    disabledBtns();
  })
}

async function getNewData() {
  await pageIndex--;
  const databaseRef = await ref(database, reference);
  const databaseOrder = await query(databaseRef, orderByChild(referenceOrder));
  const databaseStart = await query(databaseOrder, endBefore(firstKey));
  const databaseLimit = await query(databaseStart, limitToLast(size));

  await onValue(databaseLimit, (snapshot) => {
    referenceTbody.innerHTML = '';

    Object.entries(snapshot.val()).reverse().map(( [key, data] ) => referenceTbody.innerHTML += referenceRow(key, data));

    firstKey = Object.values(snapshot.val()).shift().ID;
    lastKey = Object.values(snapshot.val()).pop().ID;

    disabledBtns();
  })
  
  //const buttons = document.querySelectorAll('.PagesNumber button');
  //buttons.forEach(btn => btn.classList.remove('active'));
  //buttons[pageIndex - 1].classList.add('active');
}

async function getOldData() {
  await pageIndex++;
  const databaseRef = await ref(database, reference);
  const databaseOrder = await query(databaseRef, orderByChild(referenceOrder));
  const databaseStart = await query(databaseOrder, startAfter(lastKey));
  const databaseLimit = await query(databaseStart, limitToFirst(size));

  await onValue(databaseLimit, (snapshot) => {
    referenceTbody.innerHTML = '';
    
    Object.entries(snapshot.val()).reverse().map(( [key, data] ) => referenceTbody.innerHTML += referenceRow(key, data));

    firstKey = Object.values(snapshot.val()).shift().ID;
    lastKey = Object.values(snapshot.val()).pop().ID;

    disabledBtns();
  })
  
  //const buttons = document.querySelectorAll('.PagesNumber button');
  //buttons.forEach(btn => btn.classList.remove('active'));
  //buttons[pageIndex - 1].classList.add('active');
}

async function GetWantedData(fromWantedKey, toWantedKey, pageNumber) {
  pageIndex = pageNumber;
  const databaseRef = await ref(database, reference);
  const databaseOrder = await query(databaseRef, orderByChild(referenceOrder));
  const databaseStart = await query(databaseOrder, startAfter(fromWantedKey));
  const databaseEnd = await query(databaseStart, endAt(toWantedKey));
  const databaseLimit = await query(databaseEnd, limitToLast(size));
  
  onValue(databaseLimit, (snapshot) => {
    referenceTbody.innerHTML = '';
    
    Object.entries(snapshot.val()).reverse().map(( [key, data] ) => referenceTbody.innerHTML += referenceRow(key, data));
  
    firstKey = Object.values(snapshot.val()).shift().ID;
    lastKey = Object.values(snapshot.val()).pop().ID;
  
    disabledBtns();
  })
}

/**********************************************************
async function numbersPagination() {
  const buttons = document.querySelectorAll('.PagesNumber button');
  
  buttons[buttons.length-1].classList.add('active')
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
**********************************************************/

function Search() {
  const inpValue = document.querySelector('[data-value]').value.toUpperCase();
  const tableRows = document.querySelectorAll('[data-state]');

  tableRows.forEach((Row) => {
    const Content = Row.querySelector('td:nth-child(3)');
    const Title = Content.textContent.toUpperCase() || Content.innerText.toUpperCase();
    
    Title.indexOf(inpValue) > -1 ? Row.style.display = '' : Row.style.display = 'none';
  })
}

function FilterSelection(label) {
  const books = document.querySelectorAll('[data-state]');
  
  if(label === 'Show All') label = ''
  books.forEach((book) => {
    book.style.display = 'none';
    const state = book.getAttribute('data-state').indexOf(label)>-1;
    if(state) book.style.display = 'table-row';
  })
}

function SortAsc() {
  const list = document.querySelector('.listTbody');
  let switching = true, switchcount = 0, shouldSwitch, dir = "asc", i, c, b;
  while (switching) {
    switching = false;
    c = list.getElementsByTagName("tr");
    b = list.querySelectorAll('tr td:nth-child(3) p:nth-child(1)');
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if (dir === "asc") {
        if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      c[i].parentNode.insertBefore(c[i + 1], c[i]);
      switching = true;
      switchcount++;
    }
  }
}

function SortDesc() {
  const list = document.querySelector('.listTbody');
  let switching = true, switchcount = 0, shouldSwitch, dir = 'desc', i, c, b;
  while (switching) {
    switching = false;
    c = list.getElementsByTagName("tr");
    b = list.querySelectorAll('tr td:nth-child(3) p:nth-child(1)');
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if (dir === "desc") {
        if (b[i].innerHTML.toLowerCase() < b[i + 1].innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      c[i].parentNode.insertBefore(c[i + 1], c[i]);
      switching = true;
      switchcount++;
    }
  }
}

function SortById(direction) {
  const list = document.querySelector('.listTbody');
  let i, b, c, shouldSwitch, switching = true;
  while (switching) {
    switching = false;
    c = list.getElementsByTagName("tr");
    b = list.querySelectorAll('tr td:nth-child(2)');
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      
      if(direction === false) {
      
        if (Number(b[i].innerHTML) > Number(b[i + 1].innerHTML)) {
          shouldSwitch = true;
          break;
        }
      
      } else if (direction === true) {
        
        if (Number(b[i].innerHTML) < Number(b[i + 1].innerHTML)) {
          shouldSwitch = true;
          break;
        }
        
      }
      
    }
    if (shouldSwitch) {
      c[i].parentNode.insertBefore(c[i + 1], c[i]);
      switching = true;
    }
  }
}

function SortingWay(way) {
  if(way === 'Asc') {
    SortAsc();
  } else if(way === 'Desc') {
    SortDesc();
  } else if(way === 'ById') {
    idDirection = !idDirection;
    
    SortById(idDirection);
  }
}

window.addEventListener('DOMContentLoaded', async (event) => {
  const { names } = await import('./MangaTitles.js');
  const editType = WindowPARAMS.get('ref');
  const checkType = WindowPARAMS.get('type');
  
  if(WindowPATH === '/_/' || WindowPATH === '/_/index.html') {
    [...new Set(names)].sort().forEach((name) => {
      MangaForm.querySelector('#Titles').innerHTML +=
        `<option value="${name}">${name}</option>`;
    
      VolumeForm.querySelector('#Titles').innerHTML +=
        `<option value="${name}">${name}</option>`;
    })

    MangaForm.addEventListener('submit', async (event) => {
      const { Manga } = await import('./components.js');

      const newManga = new Manga(MangaForm, {
        Title: MangaForm.Title.value,
        Cover: MangaForm.Cover.value,
        Count: MangaForm.Count.value,
        State: MangaForm.State.value,
        Type: MangaForm.Type.value,
        CreationDate: MangaForm.CreationDate.value
      });
    
      MangaUpload(newManga);
    })
    
    VolumeForm.addEventListener('submit', async (event) => {
      const { Volume } = await import('./components.js');

      const newVolume = new Volume(VolumeForm, {
        Title: VolumeForm.Title.value,
        VolNumber: VolumeForm.VolNumber.value,
        Cover: VolumeForm.Cover.value,
        Type: VolumeForm.Type.value
      });
    
      VolumeUpload(newVolume);
    })

    getData();
    getList();
    FormsID();

    getOldDataBtn.addEventListener('click', () => getOldData());
    getNewDataBtn.addEventListener('click', () => getNewData());
    
    SearchFilter.addEventListener('submit', event => event.preventDefault());
    SearchFilter.Search.addEventListener('keyup', () => Search());
    
    StateFilter.addEventListener('submit', event => event.preventDefault());
    
    StateFilterBtns[0].classList.add('active');
    StateFilterBtns.forEach((Btn) => {
      Btn.addEventListener('click', (event) => {
        StateFilterBtns.forEach(Btn => Btn.classList.remove('active'));
        Btn.classList.add('active');
        const state = event.target.textContent;
        
        FilterSelection(state);
      });
    })
    
    SortingFilter.addEventListener('submit', event => event.preventDefault());
    
    SortingFilterBtns[SortingFilterBtns.length-1].classList.add('active');
    SortingFilterBtns.forEach((Btn) => {
      Btn.addEventListener('click', (event) => {
        SortingFilterBtns.forEach(Btn => Btn.classList.remove('active'));
        Btn.classList.add('active');
        const Way = event.target.textContent.split(' ').pop();
    
        SortingWay(Way);
      });
    })
    
  } else if(WindowPATH === '/_/manga.html' && WindowREF !== '') {
    
    getManga(WindowREF, checkType);
    
  } else if(WindowPATH === '/_/edit.html' && editType === 'mangalist') {
    VolumeUpdateForm.style.display = 'none';

    [...new Set(names)].sort().forEach((name) => {
      MangaForm.querySelector('#Titles').innerHTML +=
        `<option value="${name}">${name}</option>`;
    })

    OpenMangaEdit(MangaUpdateForm, WindowREF);

    MangaUpdateForm.addEventListener('submit', async (event) => {
      const { nManga } = await import('./components.js');

      const newManga = new nManga({
        Title: MangaUpdateForm.Title.value,
        Cover: MangaUpdateForm.Cover.value,
        Count: MangaUpdateForm.Count.value,
        State: MangaUpdateForm.State.value,
        Type: MangaUpdateForm.Type.value,
        CreationDate: MangaUpdateForm.CreationDate.value
      });

      MangaUpdate(WindowREF, newManga);
    })
  } else if(WindowPATH === '/_/edit.html' && editType === 'volumelist') {
    MangaUpdateForm.style.display = 'none';

    [...new Set(names)].sort().forEach((name) => {
      VolumeForm.querySelector('#Titles').innerHTML +=
        `<option value="${name}">${name}</option>`;
    })

    OpenVolumeEdit(VolumeUpdateForm, WindowREF);

    VolumeUpdateForm.addEventListener('submit', async (event) => {
      const { nVolume } = await import('./components.js');

      const newVolume = new nVolume({
        Title: VolumeUpdateForm.Title.value,
        Cover: VolumeUpdateForm.Cover.value,
        Type: VolumeUpdateForm.Type.value,
        VolNumber: VolumeUpdateForm.VolNumber.value,
      });

      VolumeUpdate(WindowREF, newVolume);
    })
  }
});

window.MangaRemove = MangaRemove;
window.VolumeRemove = VolumeRemove;

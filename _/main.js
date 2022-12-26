import { listRow, referenceRow } from './components.js';

import {
  database, ref, child, onValue, set, get, push, update, remove,
  query, orderByChild, limitToLast, limitToFirst, startAfter, endBefore,
  reference, list
} from './firebase.js';

const WindowPATH = window.location.pathname;
const WindowREF = window.location.href.split('/').pop();

const forms = document.querySelectorAll('form');
const MangaForm = document.querySelector('.MangaForm');
const VolumeForm = document.querySelector('.VolumeForm');
const MangaUpdateForm = document.querySelector('.MangaUpdateForm');

const listTbody = document.querySelector('.listTbody');
const referenceTbody = document.querySelector('.referenceTbody');

let referenceOrder = 'ID', size = 4, pageIndex = 1;
let firstKey = null, lastKey = null, firstChild = null, lastChild = null;

const getOldDataBtn = document.querySelector('.NewDataBtn');
const getNewDataBtn = document.querySelector('.OldDataBtn');
const PagesCount = document.querySelector('.PagesCount');

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
}

function MangaUpload({ ID, Title, Cover, Count, State, Type, CreationDate }) {
  const databaseRef = ref(database, list);
  const databasePush = push(databaseRef);

  set(databasePush, {
    ID, Title, Cover, Count, State, Type, CreationDate
  }).then(() => {
    console.log('upload done');
    MangaForm.reset();
    FormsID();
  }).catch(error => console.log(error))
}

function VolumeUpload({ ID, Title, Cover, VolNumber, CreatedAt }) {
  const databaseRef = ref(database, reference);
  const databaseChild = child(databaseRef, `${CreatedAt}/`);

  set(databaseChild, {
    ID, Title, Cover, 'Number': VolNumber, CreatedAt
  }).then(() => {
    console.log('upload done');
    VolumeForm.reset();
    FormsID();
  }).catch(error => console.log(error))
}

function MangaUpdate(uid, { Title, Cover, Count, State, Type, CreationDate }) {
  const databaseRef = ref(database, list);
  const databaseChild = child(databaseRef, `${uid}`);

  update(databaseChild, {
    Title, Cover, Count, State, Type, CreationDate
  }).then(() => {
    console.log('update done');
    MangaUpdateForm.reset();
  }).catch(error => console.log(error))
}

function MangaRemove(key) {
  const que = confirm('Delete This Manga');

  switch (que) {
    case true:
      const databaseRef = ref(database, list);
      const databaseChild = child(databaseRef, key);

      remove(databaseChild).then(() => {
        console.log(`Manga Removed done`);
        FormsID();
      }).catch(error => console.log(error));
      break;
    case false:
      alert('Operation Canceld !');
      break;
  }
}

async function OpenEdit(form, id) {
  const databaseRef = await ref(database, list);
  const databaseChild = await child(databaseRef, `${id}/`);
  
  await onValue(databaseChild, (snapshot)=> {
    const key = snapshot.key;
    const data = snapshot.val();
    
    setTimeout(()=> {
    
      form.Title.value = data.Title;
      form.Count.value = data.Count;
      form.State.value = data.State;
      form.Cover.value = data.Cover;
      form.CreationDate.value = new Date(data.CreationDate).toISOString().split('Z').shift();
    }, 2000);
  })
}

async function Keys() {
  const databaseOrder = await query(ref(database, reference), orderByChild(referenceOrder));
  const snap = await get(databaseOrder).then(snapshot => snapshot.val());
  const data = Object.values(snap);

  firstChild = data.shift().ID;
  lastChild = data.pop().ID;
  
  console.log({ firstChild, lastChild });
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

async function getData() {
  const databaseRef = await ref(database, reference);
  const databaseOrder = await query(databaseRef, orderByChild(referenceOrder));
  const databaseLimit = await query(databaseOrder, limitToLast(size));

  await onValue(databaseLimit, (snapshot) => {
    referenceTbody.innerHTML = '';

    Object.entries(snapshot.val()).reverse().map(( [key, data] ) => referenceTbody.innerHTML += referenceRow(key, data));

    firstKey = Object.values(snapshot.val()).shift().ID;
    lastKey = Object.values(snapshot.val()).pop().ID;

    disabledBtns();
  })

  await Keys();
}

async function getNewData() {
  await pageIndex++;
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
}

async function getOldData() {
  await pageIndex--;
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
}

window.onload = async () => {
  const { names } = await import('./MangaTitles.js');
  
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
        Cover: VolumeForm.Cover.value,
        VolNumber: VolumeForm.VolNumber.value
      });
    
      VolumeUpload(newVolume);
    })

    getData();
    getList();
    FormsID();

    getOldDataBtn.addEventListener('click', () => getOldData());
    getNewDataBtn.addEventListener('click', () => getNewData());

  } else if(WindowPATH === '/_/edit.html') {
    names.forEach((name) => {
      MangaUpdateForm.querySelector('#Titles').innerHTML +=
        `<option value="${name}">${name}</option>`;
    })

    OpenEdit(MangaUpdateForm ,WindowREF);

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
  }
}

window.MangaRemove = MangaRemove;
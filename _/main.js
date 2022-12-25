import { listRow, referenceRow } from './components.js';
import { Manga, Volume, nManga } from './components.js';

import {
  database, ref, child, onValue, set, get, push, update, remove,
  query, orderByChild, limitToLast, limitToFirst, startAfter, endBefore,
  reference, list
} from './firebase.js';

const forms = document.querySelectorAll('form');

const MangaForm = document.querySelector('.MangaForm');
const VolumeForm = document.querySelector('.VolumeForm');

const MangaUpdateForm = document.querySelector('.MangaUpdateForm');

forms.forEach(form => form.addEventListener('submit', event => event.preventDefault()));

function MangaUpload({ ID, Title, Cover, Count, State, Type, CreationDate }) {
  const databaseRef = ref(database, list);
  const databasePush = push(databaseRef);

  set(databasePush, {
    ID, Title, Cover, Count, State, Type, CreationDate
  }).then(() => {
    console.log('upload done');
    MangaForm.reset();
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

let names = [
  'Sakamoto Days',
  'One Piece',
  'Fullmetal Alchemist',
  'Kingdom',
  'Haikyuu!!',
  'Akatsuki no Yona',
  'Hunter x Hunter',
  'Death Note',
  'Shigatsu wa Kimi no Uso',
  'Jibaku Shounen Hanako-kun',
  'Dragon Ball',
  'Bakuman.',
  'Wotaku ni Koi wa Muzukashii',
  'Detective Conan',
  'Tonikaku Kawaii',
  'Sword Art Online',
  'Naruto',
  'Naruto: Shippuuden',
  'No Game No Life',
  'Re:Zero kara Hajimeru Isekai Seikatsu',
  'Fairy Tail',
  'Shokugeki no Souma',
  'Mob Psycho 100',
  'Tate no Yuusha no Nariagari',
  'Overlord',
  'Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen',
  'Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka',
  'Highschool of the Dead',
  'Kakegurui',
  'Ao No Exorcist', 'Attack On Titans', 'Dr: Stone', 'The Promised Neverland', 'Samurai 8 Hachimaruden', 'Kimetsu No Yaiba', 'Mairimashita, Senpai', 'Kuzumi-Kun Cant You Read the Room', 'Burn The Witch', 'I Sold My Life For Ten Thousand Yen Per Year', 'Tokyo Ghoul', 'Tokyo Ghoul:re', 'Black Clover', 'Boku No Hero Academia', 'One Punch Man', 'Jujutsu Kaisen', 'Chainsaw Man', 'The Four Knights of Apocalypse', 'Boruto NNG', 'Fairy Tail 100 Years Quest', 'Dragon Ball Super', 'Nanatsu no Taizai', 'Noragami', 'Edens Zero', 'Record Of Ragnarok', 'Tokyo Revengers', 'Fire Force', "Komi Can't Communicate", 'Made in Abyss', 'Vinland Saga', 'Platinum End', 'Perfect World', 'Tate No Yuusha No Nariagari', 'Death Note Tokubetsu Yomikiri', 'Golden Kamuy', 'Vagabond', 'Spy X Family', 'Kaiju No. 8', 'Horimiya', 'Berserk', 'Kiseijuu', 'Fairy Tail Zero', 'Monster', 'Blue Lock', 'Fire Punch', 'Jujutsu Kaisen 0', 'Pumpkin Night', 'Kimi no Na wa', 'Ao Haru Ride', 'Koe no Katachi', 'Zetman', 'Dr. Stone Reboot: Byakuya', 'Tate No Yuusha No Nariagari', 'Sword Art Online', 'Overlord', 'One Piece', 'Haikyuu!!', 'Tonikaku Kawaii', 'Sakamoto Days']


//forms.forEach((form) => {
//  form.addEventListener('submit', () => {
//    console.log(form.Title.value);
//  })
//})

const listTbody = document.querySelector('.listTbody');
const referenceTbody = document.querySelector('.referenceTbody');

let referenceOrder = 'ID', size = 10;
let firstKey = null, lastKey = null;
let firstChild = null, lastChild = null;

const getOldDataBtn = document.querySelector('.NewDataBtn');
const getNewDataBtn = document.querySelector('.OldDataBtn');

async function Keys() {
  const databaseOrder = await query(ref(database, reference), orderByChild(referenceOrder));
  const snap = await get(databaseOrder).then(snapshot => snapshot.val());
  const data = Object.values(snap);

  firstChild = data[0].ID;
  lastChild = data.pop().ID;
  
  console.log({ firstChild, lastChild });
  
  const xSize = await get(databaseOrder).then(snapshot => snapshot.size);
  console.log(`there is ${xSize} volume = ${xSize/size} page => with Math.floor()+1 = ${Math.floor(xSize/size)+1} pages`);
}

async function disabledBtns() {
  lastChild === lastKey ? getOldDataBtn.disabled = true : getOldDataBtn.disabled = false;
  firstChild === firstKey ? getNewDataBtn.disabled = true : getNewDataBtn.disabled = false;
}

let run = setInterval(() => {

  if (firstChild !== null && lastChild !== null) {
    disabledBtns();
    clearInterval(run);
  }

}, 100);



async function FormsID() {
  const listDatabaseRef = await query(ref(database, list), orderByChild('ID'));
  const listSnaps = await get(listDatabaseRef).then(snapshot => Object.values(snapshot.val()).pop().ID);
  const listNewID = await listSnaps + 1;

  const referenceDatabaseRef = await query(ref(database, reference), orderByChild('ID'));
  const referenceSnaps = await get(referenceDatabaseRef).then(snapshot => Object.values(snapshot.val()).pop().ID);
  const referenceNewID = await referenceSnaps + 1;
}



function getList() {
  const databaseRef = ref(database, list);

  onValue(databaseRef, async (snapshot) => {
    listTbody.innerHTML = '';
    await MangaForm.setAttribute('id', Object.values(snapshot.val()).pop().ID + 1);

    snapshot.forEach((snap) => {
      const key = snap.key;
      const data = snap.val();

      listTbody.innerHTML =
        listRow(key, data) +
        listTbody.innerHTML;
    });
  })
}

function getData() {
  const databaseRef = ref(database, reference);
  const databaseOrder = query(databaseRef, orderByChild(referenceOrder));
  const databaseLimit = query(databaseOrder, limitToLast(size));

  onValue(databaseLimit, (snapshot) => {
    referenceTbody.innerHTML = '';
    VolumeForm.setAttribute('id', Object.values(snapshot.val()).pop().ID + 1);

    snapshot.forEach((snap) => {
      const key = snap.key;
      const data = snap.val();

      referenceTbody.innerHTML =
        referenceRow(key, data) +
        referenceTbody.innerHTML;
    })
    firstKey = Object.values(snapshot.val())[0]['ID'];
    lastKey = Object.values(snapshot.val()).pop()['ID'];

    disabledBtns();
  })
}

function getNewData() {
  const databaseRef = ref(database, reference);
  const databaseOrder = query(databaseRef, orderByChild(referenceOrder));
  const databaseStart = query(databaseOrder, endBefore(firstKey));
  const databaseLimit = query(databaseStart, limitToLast(size));

  onValue(databaseLimit, (snapshot) => {
    referenceTbody.innerHTML = '';
    snapshot.forEach(snap => {
      const key = snap.key;
      const data = snap.val();

      referenceTbody.innerHTML =
        referenceRow(key, data) +
        referenceTbody.innerHTML;
    })
    firstKey = Object.values(snapshot.val())[0]['ID'];
    lastKey = Object.values(snapshot.val()).pop()['ID'];

    disabledBtns();
  })
}

function getOldData() {
  const databaseRef = ref(database, reference);
  const databaseOrder = query(databaseRef, orderByChild(referenceOrder));
  const databaseStart = query(databaseOrder, startAfter(lastKey));
  const databaseLimit = query(databaseStart, limitToFirst(size));

  onValue(databaseLimit, (snapshot) => {
    referenceTbody.innerHTML = '';
    snapshot.forEach(snap => {
      const key = snap.key;
      const data = snap.val();

      referenceTbody.innerHTML =
        referenceRow(key, data) +
        referenceTbody.innerHTML;
    })
    firstKey = Object.values(snapshot.val())[0]['ID'];
    lastKey = Object.values(snapshot.val()).pop()['ID'];

    disabledBtns();
  })
}

/*
function GetListV2() {
  const databaseRef = ref(database, reference);

  onValue(databaseRef, async (snapshot) => {
    const snaps = Object.values(snapshot.val());
    const newSnaps = [...new Map(snaps.map((m) => [m.Title, m])).values()];

    console.log(newSnaps);
  })
}
*/

const WindowPATH = window.location.pathname;
const WindowREF = window.location.href.split('/').pop();

window.onload = () => {
  if(WindowPATH === '/_/' || WindowPATH === '/_/index.html') {

    names.forEach((name) => {
      MangaForm.querySelector('#Titles').innerHTML +=
        `<option value="${name}">${name}</option>`;
    
      VolumeForm.querySelector('#Titles').innerHTML +=
        `<option value="${name}">${name}</option>`;
    })

    MangaForm.addEventListener('submit', (event) => {
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
    
    VolumeForm.addEventListener('submit', (event) => {
      const newVolume = new Volume(VolumeForm, {
        Title: VolumeForm.Title.value,
        Cover: VolumeForm.Cover.value,
        VolNumber: VolumeForm.VolNumber.value
      });
    
      VolumeUpload(newVolume);
    })

    getData();
    getList();
    Keys();

    getOldDataBtn.addEventListener('click', () => getOldData());
    getNewDataBtn.addEventListener('click', () => getNewData());

  } else if(WindowPATH === '/_/edit.html') {
    names.forEach((name) => {
      MangaUpdateForm.querySelector('#Titles').innerHTML +=
        `<option value="${name}">${name}</option>`;
    })

    OpenEdit(MangaUpdateForm ,WindowREF);

    MangaUpdateForm.addEventListener('submit', (event) => {
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


function OpenEdit(form, id) {
  const databaseRef = ref(database, list);
  const databaseChild = child(databaseRef, `${id}/`);
  
  onValue(databaseChild, (snapshot)=> {
    const key = snapshot.key;
    const data = snapshot.val();
    
    setTimeout(()=> {
    
      form.Title.value = data.Title;
      form.Count.value = data.Count;
      form.State.value = data.State;
      form.Cover.value = data.Cover;

      const one = new Date(data.CreationDate);
      const two = one.toISOString();

      console.log(two.split('Z').shift());

      form.CreationDate.value = two.split('Z').shift();
      
      console.log(data);
      
    }, 2000);
  })
}
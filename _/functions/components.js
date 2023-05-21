import { MangaDelete } from './delete/manga.js';
import { VolumeDelete } from './delete/volume.js';

import { StateBg, States, Types, toDigits, toDates } from './assets.js';

function MangaRow(key, { ID, Title, Cover, VolCount, State, Type, Dates, Magazine }) {
  return `
    <tr x-data="{openEdit: false}" data-state="${State}" style="background-color: ${StateBg[State]};">
      <td><img src="${Cover}" alt="${Title}" /></td>
      <td>${ID}</td>
      <td>
        <p>${Title}: ${toDigits(VolCount, 3)}</p>
        <p>${toDates(Dates['PubAt'], 'long')}</p>
        <p>${Type}</p>
        <p>Magazine: ${Magazine}</p>
      </td>
      <td>
        <button class="delBtn" onclick="MangaDelete('${key}')">delete</button>
        <!--a href="./edit.html#/${key}?ref=mangalist" target="_blank"-->
          <button class="ediBtn" x-on:click="openEdit = ! openEdit">edit</button>
        <!--/a-->
        <a href="./manga.html?title=${Title.replaceAll(' ', '_')}&type=${Type.replaceAll(' ', '_')}" target="_blank">
          <button class="cheBtn">check</button>
        </a>
        
        <section x-show="openEdit" x-cloak>
          ${EditMangaForm(key, { ID, Title, Cover, VolCount, State, Type, Dates, Magazine })}
        </section>
      </td>
    </tr> 
  `;
}

function EditMangaForm(key, { ID, Title, Cover, VolCount, State, Type, Dates, Magazine }) {
  const Time = new Date(Dates['PubAt']).toISOString().split('T').shift();
  
  return `
    <form x-on:submit.prevent="HandleMangaUpdate" class="MangaUpdateForm" autocapitalize="off" id="${key}">
      <button class="close" type="button" x-on:click="openEdit = ! openEdit">&times;</button>
      <div class="FormGroup">
        <label for="Title">Title</label>
        <input type="text" list="Titles" name="Title" id="Title" value="${Title}" placeholder="Title" />
        <datalist id="Titles"></datalist>
      </div>
      <div class="FormGroup">
        <label for="Cover">Cover</label>
        <input type="url" name="Cover" id="Cover" value="${Cover}" placeholder="Cover..." />
      </div>
      <div class="FormGroup">
        <label for="VolCount">Vol Count</label>
        <input type="number" name="VolCount" id="VolCount" value="${VolCount}" placeholder="Volume Count..." />
      </div>
      <div class="FormGroup">
        <label for="Magazine">Magazine</label>
        <input type="text" list="Magazines" name="Magazine" id="Magazine" value="${Magazine}" placeholder="Magazine..." />
        <datalist id="Magazines"></datalist>
      </div>
      <div class="FormGroup">
        <label for="State">State</label>
        <select name="State" id="State">
          ${States.map(item => `<option value="${item}" ${State === item ? `selected` : ``}>${item}</option>`)}
        </select>
      </div>
      <div class="FormGroup">
        <label for="Type">Type</label>
        <select name="Type" id="Type">
          ${Types.map(item => `<option value="${item}" ${Type === item ? `selected` : ``}>${item}</option>`)}
        </select>
      </div>
      <div class="FormGroup">
        <label for="PubAt">PubAt</label>
        <input type="date" name="PubAt" id="PubAt" value="${Time}" placeholder="Creation Date..." />
      </div>
      <div class="FormGroup">
        <button type="submit">update manga</button>
      </div>
    </form>
  `;
}

async function HandleMangaUpdate(event) {
  const { Title, Cover, VolCount, State, Type, PubAt, Magazine } = event.target;
  const key = event.target.getAttribute('id');
  
  const newManga = new nManga({
    Title: Title.value,
    Cover: Cover.value,
    VolCount: VolCount.value,
    State: State.value,
    Type: Type.value,
    PubAt: PubAt.value,
    Magazine: Magazine.value
  });
  
  const { MangaUpdate } = await import('./update/manga.js');
  MangaUpdate(key, newManga);
}

function VolumeRow(key, { ID, Title, VolNumber, Cover, Type, Dates }) {
  return `
    <tr x-data="{openEdit: false}">
      <td><img src="${Cover}" alt="${Title}" /></td>
      <td>${ID}</td>
      <td>
        <p>${Title}: ${toDigits(VolNumber, 3)}</p>
        <p>${toDates(Dates['PubAt'], 'long')}</p>
        <p>Type: ${Type}</p>
      </td>
      <td>
        <button class="delBtn" onclick="VolumeDelete('${key}')">delete</button>
        <!--a href="./edit.html#/${key}?ref=volumelist" target="_blank"-->
          <button class="ediBtn" x-on:click="openEdit = ! openEdit">edit</button>
        <!--/a-->
        
        <section x-show="openEdit" x-cloak>
          ${EditVolumeForm({ ID, Title, VolNumber, Cover, Type, Dates })}
        </section>
      </td>
    </tr>
  `;
}

function EditVolumeForm({ ID, Title, VolNumber, Cover, Type, Dates }) {
  const Time = new Date(Dates['PubAt']).toISOString().split('T').shift();
  const key = Dates['CreAt'];

  return `
    <form x-on:submit.prevent="HandleVolumeUpdate" class="VolumeUpdateForm" autocapitalize="off" id="${key}">
      <button class="close" type="button" x-on:click="openEdit = ! openEdit">&times;</button>
      <div class="FormGroup">
        <label for="Title">Title</label>
        <input type="text" list="Titles" name="Title" id="Title" value="${Title}" placeholder="Title" />
        <datalist id="Titles"></datalist>
      </div>
      <div class="FormGroup">
        <label for="VolNumber">Number</label>
        <input type="text" name="VolNumber" id="VolNumber" value="${VolNumber}" placeholder="Number..." />
      </div>
      <div class="FormGroup">
        <label for="Cover">Cover</label>
        <input type="url" name="Cover" id="Cover" value="${Cover}" placeholder="Cover..." />
      </div>
      <div class="FormGroup">
        <label for="Type">Type</label>
        <select name="Type" id="Type">
          ${Types.map(item => `<option value="${item}" ${Type === item ? `selected` : ``}>${item}</option>`)}
        </select>
      </div>
      <div class="FormGroup">
        <label for="PubAt">PubAt</label>
        <input type="date" name="PubAt" id="PubAt" value="${Time}" placeholder="Creation Date..." />
      </div>
      <div class="FormGroup">
        <button type="submit">update volume</button>
      </div>
    </form>
  `;
}

async function HandleVolumeUpdate(event) {
  const { Title, Cover, VolNumber, Type, PubAt } = event.target;
  const key = event.target.getAttribute('id');

  const newManga = new nVolume({
    Title: Title.value,
    Cover: Cover.value,
    VolNumber: VolNumber.value,
    Type: Type.value,
    PubAt: PubAt.value,
  });

  const { VolumeUpdate } = await import('./update/volume.js');
  VolumeUpdate(key, newManga);
}

export { MangaRow, VolumeRow }

/*
const insert = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index)
]
const newCover = insert(Cover.split('?').at(0).split('/'), 4, 'tr:w-200').join('/');
*/

class Manga {
  constructor(MangaForm, {Title, Cover, VolCount, State, Type, PubAt, Magazine}) {
    const newCover = Cover.split('?').shift().replace('/DzManga4Up/', '/DzManga4Up/tr:w-200/');
    
    this.ID = Number(MangaForm.id);
    this.Title = String(Title);
    this.Cover = String(newCover);
    this.VolCount = Number(VolCount);
    this.Magazine = String(Magazine);
    this.State = String(State);
    this.Type = String(Type);
    this.Dates = {
      CreAt: Number(new Date().getTime()),
      PubAt: Number(new Date(PubAt).getTime())
    }
  }
}

class Volume {
  constructor(VolumeForm, {Title, VolNumber, Cover, Type, PubAt}) {
    const newCover = Cover.split('?').shift().replace('/DzManga4Up/', '/DzManga4Up/tr:w-200/');
    
    this.ID = Number(VolumeForm.id);
    this.Title = String(Title);
    this.Cover = String(newCover);
    this.VolNumber = Number(VolNumber);
    this.Type = String(Type);
    this.Dates = {
      CreAt: Number(new Date().getTime()),
      PubAt: Number(new Date(PubAt).getTime())
    }
  }
}

export { Manga, Volume}

class nManga {
  constructor({Title, Cover, VolCount, State, Type, PubAt, Magazine}) {
    const newCover = Cover.split('?').shift().replace('/DzManga4Up/', '/DzManga4Up/tr:w-200/');
    const CoverCheck = Cover.match('/tr:w-200/') ? Cover : newCover;

    this.Title = String(Title);
    this.Cover = String(CoverCheck);
    this.VolCount = Number(VolCount);
    this.State = String(State);
    this.Type = String(Type);
    this.Magazine = String(Magazine);
    this.Dates = {
      PubAt: Number(new Date(PubAt).getTime())
    }
  }
}

class nVolume {
  constructor({Title, VolNumber, Cover, Type, PubAt}) {
    const newCover = Cover.split('?').shift().replace('/DzManga4Up/', '/DzManga4Up/tr:w-200/');
    const CoverCheck = Cover.match('/tr:w-200') ? Cover : newCover;

    this.Title = String(Title);
    this.Cover = String(CoverCheck);
    this.VolNumber = Number(VolNumber);
    this.Type = String(Type);
    this.Dates = {
      PubAt: Number(new Date(PubAt).getTime())
    }
  }
}

window.MangaDelete = MangaDelete;
window.VolumeDelete = VolumeDelete;

window.HandleMangaUpdate = HandleMangaUpdate;
window.HandleVolumeUpdate = HandleVolumeUpdate;
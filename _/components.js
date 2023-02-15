const StateBg = {
  'Publishing': '#4ade80',
  'Finished': '#60a5fa',
  'Discontinued': '#f87171',
  'On Hiatus': '#facc15',
};

function listRow(key, { ID, Title, Cover, Count, State, Type, CreationDate }) {
  return `
    <tr data-state="${State}" id="${key}" style="background-color: ${StateBg[State]};">
      <td><img src="${Cover}" alt="${Title}" /></td>
      <td>${ID}</td>
      <td>
        <p>${Title}: ${Number(Count).toLocaleString('en-US', {minimumIntegerDigits: 3})}</p>
        <p>${new Date(CreationDate).toLocaleDateString('en-US', {dateStyle: 'long'})}</p>
      </td>
      <td>
        <button class="delBtn" onclick="MangaRemove('${key}')">delete</button>
        <a href="./edit.html#/${key}?ref=list" target="_blank">
          <button class="ediBtn" >edit</button>
        </a>
        <a href="./manga.html#/${Title.replaceAll(' ', '_')}?type=${Type.replaceAll(' ', '_')}" target="_blank">
          <button class="cheBtn" >check</button>
        </a>
      </td>
    </tr>
  `;
}
function referenceRow(key, { ID, Title, Number: VolNumber, Cover, Type }) {
  return `
    <tr id="${key}">
      <td><img src="${Cover}" alt="${Title}" /></td>
      <td>${ID}</td>
      <td>
        <p>${Title}: ${Number(VolNumber).toLocaleString('en-US', {minimumIntegerDigits: 3})}</p>
        <p>Type: ${Type}</p>
      </td>
      <td>
        <button class="delBtn" onclick="VolumeRemove('${key}')">delete</button>
        <a href="./edit.html#/${key}?ref=manga4up" target="_blank">
          <button class="ediBtn" >edit</button>
        </a>
      </td>
    </tr>
  `;
}

function numberBtn(i, s) {
  return `<button page="${i+1}" from="${s*i}" to="${s*Number(i+1)}">${Number(i+1).toLocaleString('en-US', {minimumIntegerDigits: 3})}</button>`;
}

export { listRow, referenceRow, numberBtn }

const insert = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index)
]

class Manga {
  constructor(MangaForm, {Title, Cover, Count, State, Type, CreationDate}) {
    const newCover = insert(Cover.split('?').at(0).split('/'), 4, 'tr:w-200').join('/');

    this.Title = Title;
    this.Cover = newCover;
    this.Count = Number(Count);
    this.State = State;
    this.Type = Type;
    this.CreationDate = Number(new Date(CreationDate).getTime());
    this.Time = Number(new Date().getTime());
    this.ID = Number(MangaForm.id);
  }
}

class Volume {
  constructor(VolumeForm, {Title, VolNumber, Cover, Type}) {
    const newCover = insert(Cover.split('?').at(0).split('/'), 4, 'tr:w-200').join('/');
    
    this.Title = Title;
    this.VolNumber = Number(VolNumber);
    this.Cover = newCover;
    this.Type = Type;
    this.ID = Number(VolumeForm.id);
    this.CreatedAt = new Date().getTime();
  }
}

export { Manga, Volume}

class nManga {
  constructor({Title, Cover, Count, State, Type, CreationDate}) {
    const newCover = insert(Cover.split('?').at(0).split('/'), 4, 'tr:w-200').join('/');
    const CoverCheck = Cover.match('/tr:w-200')?Cover:newCover;

    this.Title = Title;
    this.Cover = CoverCheck;
    this.Count = Number(Count);
    this.State = State;
    this.Type = Type;
    this.CreationDate = Number(new Date(CreationDate).getTime());
  }
}

class nVolume {
  constructor({Title, VolNumber, Cover, Type}) {
    const newCover = insert(Cover.split('?').at(0).split('/'), 4, 'tr:w-200').join('/');
    const CoverCheck = Cover.match('/tr:w-200')?Cover:newCover;

    this.Title = Title;
    this.Cover = CoverCheck;
    this.VolNumber = Number(VolNumber);
    this.Type = Type;
  }
}

export { nManga, nVolume }
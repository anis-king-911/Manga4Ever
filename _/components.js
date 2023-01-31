const StateBg = {
  'Publishing': 'rgba(87, 255, 87, .5)',
  'Finished': 'rgba(87, 87, 255, .5)',
  'On Hiatus': 'rgba(255, 87, 87, .5)',
};

function listRow(key, { ID, Title, Cover, Count, State, CreationDate }) {
  return `
    <tr data-state="${State}" id="${key}" style="background-color: ${StateBg[State]};">
      <td><img src="${Cover}" alt="${Title}" /></td>
      <td>${ID}</td>
      <td>
        <p>${Title}: ${Count}</p>
        <p>${new Date(CreationDate).toLocaleDateString('en-US', {dateStyle: 'long'})}</p>
      </td>
      <td>
        <button onclick="MangaRemove('${key}')">delete</button>
        <a href="./edit.html#/${key}?ref=list" target="_blank"><button>edit</button></a>
      </td>
    </tr>
  `
}
function referenceRow(key, { ID, Title, Number, Cover, Type }) {
  return `
    <tr id="${key}">
      <td><img src="${Cover}" alt="${Title}" /></td>
      <td>${ID}</td>
      <td>
        <p>${Title}: ${Number}</p>
        <p>Type: ${Type}</p>
      </td>
      <td>
        <button onclick="VolumeRemove('${key}')">delete</button>
        <a href="./edit.html#/${key}?ref=manga4up" target="_blank"><button>edit</button></a>
      </td>
    </tr>
  `;
}

export { listRow, referenceRow }

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
    this.Count = Count;
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
    this.Count = Count;
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
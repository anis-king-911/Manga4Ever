function listRow(key, { ID, Title, Cover }) {
  return `
    <tr id="${key}">
      <td><img src="${Cover}" alt="${Title}" /></td>
      <td>${ID}</td>
      <td>${Title}</td>
      <td>
        <button>delete</button>
        <button>edit</button>
      </td>
    </tr>
  `
}
function referenceRow(key, { ID, Title, Cover, Number}) {
  return `
    <tr id="${key}">
      <td><img src="${Cover}" alt="${Title}" /></td>
      <td>${ID}</td>
      <td>${Title}: ${Number}</td>
      <td>
        <button>delete</button>
        <button>edit</button>
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
  constructor(VolumeForm, {Title, Cover, VolNumber}) {
    const newCover = insert(Cover.split('?').at(0).split('/'), 4, 'tr:w-200').join('/');
    
    this.Title = Title;
    this.Cover = newCover;
    this.VolNumber = Number(VolNumber);
    this.ID = Number(VolumeForm.id);
    this.CreatedAt = new Date().getTime();
  }
}

export { Manga, Volume}
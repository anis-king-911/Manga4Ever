const toDate = (d) => new Date(d).toLocaleDateString('en-US', {dateStyle: 'medium'})

function Manga({ ID, Title, Cover, VolCount, State, Type, Magazine, Dates }) {
  return `
<article x-data="{openDetails: false}" data-state="${State}" data-type="${Type}" id="${ID}">
  <div class="Cover">
    <img src="${Cover}" alt="${Title}">
  </div>
  <div class="Details" x-show="openDetails" x-cloak>
    <div class="Info">
      <button x-on:click="openDetails = ! openDetails">&times;</button>
      <h2>${Title}</h2>
      <p>Type: <span>${Type}</span></p>
      <p>State: <span>${State}</span></p>
      <p>Volume Count: <span>${VolCount}</span></p>
      <p>Magazine: <span>${Magazine}</span></p>
      <p>Created At: <span>${toDate(Dates['PubAt'])}</span></p>
    </div>
  </div>
  <div class="Actions">
    <button x-on:click="openDetails = ! openDetails"><i class="fa-solid fa-circle-info"></i></button>
    <a href="./manga.html?title=${Title.replaceAll(' ', '_')}&type=${Type.replaceAll(' ', '_')}">
      <button><i class="fa-solid fa-circle-arrow-right"></i></button>
    </a>
  </div>
</article>
  `;
  // Details // See More
}

function Volume({ ID, Title, Cover, VolNumber, Dates }) {
  return `
<article id="${ID}">
  <span class="Date">${toDate(Dates['PubAt'])}</span>
  <button class="Expand"><i class="fa-solid fa-maximize"></i></button>
  <div class="Cover">
    <img src="${Cover}" alt="${Title}">
  </div>
  <span class="Title">${Title}: ${VolNumber}</span>
</article>
  `;
}

export { Manga, Volume }
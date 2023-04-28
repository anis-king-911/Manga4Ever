const toDate = (d) => new Date(d).toLocaleDateString('en-US', {dateStyle: 'long'})

function Manga({ ID, Title, Cover, VolCount, State, Type, Magazine, Dates }) {
  return `
<article data-state="${State}" data-type="${Type}" id="${ID}">
  <div class="Cover">
    <img src="${Cover}" alt="${Title}">
  </div>
  <div class="Info">
    <h2>${Title}</h2>
    <p>Type: <span>${Type}</span></p>
    <p>State: <span>${State}</span></p>
    <p>Volume Count: <span>${VolCount}</span></p>
    <p>Magazine: <span>${Magazine}</span></p>
    <p>Created At: <span>${toDate(Dates['PubAt'])}</span></p>
  </div>
  <div class="Actions">
    <a href="./manga.html?title=${Title.replaceAll(' ', '_')}&type=${Type.replaceAll(' ', '_')}">
      <button>See More</button>
    </a>
  </div>
</article>
  `;
}

function Volume({ ID, Title, Cover, VolNumber, Dates }) {
  return `
<article id="${ID}">
  <div class="Cover">
    <img src="${Cover}" alt="${Title}">
  </div>
  <div class="Info">
    <h2>${Title}: ${VolNumber}</h2>
    <h4>${toDate(Dates['PubAt'])}</h4>
  </div>
</article>
  `;
}

export { Manga, Volume }
function Manga({ ID, Title, Cover, Count, State, Type, CreationDate }) {
  return `
<article data-state="${State}" id="${ID}">
  <div class="Cover">
    <img src="${Cover}" alt="${Title}">
  </div>
  <div class="Info">
    <h2><a href="./manga.html#/${Title.replaceAll(' ', '_')}?type=${Type.replaceAll(' ', '_')}">${Title}</a></h2>
    <p>Type: <span>${Type}</span></p>
    <p>State: <span>${State}</span></p>
    <p>Volume Count: <span>${Count}</span></p>
    <p>Created At: <span>${CreationDate}</span></p>
  </div>
</article>
  `;
}

function Volume({ ID, Title, Cover, Number }) {
  return `
<article id="${ID}">
  <div class="Cover">
    <img src="${Cover}" alt="${Title}">
  </div>
  <div class="Info">
    <h2>${Title}: ${Number}</h2>
  </div>
</article>
  `;
}

export { Manga, Volume }
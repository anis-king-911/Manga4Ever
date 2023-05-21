const toDate = (d) => new Date(d).toLocaleDateString('en-US', {dateStyle: 'medium'});
const toDigits = (n) => new Number(n).toLocaleString('en-US', {minimumIntegerDigits: 3});

function Manga({ ID, Title, Cover, VolCount, State, Type, Magazine, Dates }) {
  return `
<article x-data="{openDetails: false}" data-state="${State}" data-type="${Type}" id="${ID}">
  <div class="Cover">
    <img src="${Cover}" alt="${Title}: ${VolCount}">
  </div>
  <div class="Details" x-show="openDetails" x-cloak>
    <div class="Info" x-show="openDetails" x-transition.duration.600ms>
      <button x-on:click="openDetails = ! openDetails">&times;</button>
      <h2>${Title}</h2>
      <p>Type: <span>${Type}</span></p>
      <p>State: <span>${State}</span></p>
      <p>Volume: <span>${toDigits(VolCount)}</span></p>
      ${Magazine ? `<p>Magazine: <span>${Magazine}</span></p>` : ''}
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
  //  ` : '' }
}

function Volume({ ID, Title, Cover, VolNumber, Dates }) {
  return `
<article x-data="{openModal: false}" id="${ID}">
  <div class="Actions">
    <button class="Expand" x-on:click="openModal = ! openModal">
      <i class="fa-solid fa-maximize"></i>
    </button>
    <a href="${String(Cover).replace('/tr:w-200/', '/tr:w-400/')}" target="_blank" download>
      <button class="Download"><i class="fa-solid fa-download"></i></button>
    </a>
    <span class="Date">${toDate(Dates['PubAt'])}</span>
  </div>
  <div class="Cover">
    <img src="${Cover}" alt="${Title}: ${toDigits(VolNumber)}">
  </div>
  <div class="Modal" x-show="openModal" x-cloak>
    <button x-on:click="openModal = ! openModal">&times;</button>
    <img src="${String(Cover).replace('/tr:w-200/', '/tr:w-600/')}" alt="${Title}: ${VolNumber}">
  </div>
  <span class="Title">Volume: ${toDigits(VolNumber)}</span>
</article>
  `;
}

export { Manga, Volume }
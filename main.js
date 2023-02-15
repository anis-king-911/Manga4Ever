import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getDatabase, ref, onValue
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const firebaseConfig = {
  databaseURL: "https://manga4ever-vercel-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const WindowPARAMS = new URLSearchParams(window.location.href.split('?').pop());
const WindowREF = window.location.href.split('/').pop().split('?').shift();
const WindowPATH = window.location.pathname;

const Container = document.querySelector('.Container');
const forms = document.querySelectorAll('form');

const SearchFilter = document.querySelector('.SearchFilter');
const StateFilterBtns = document.querySelectorAll('.StateFilter button');
const SortingFilterBtns = document.querySelectorAll('.SortingFilter button');

let reference = 'VolumeList/', list = 'MangaList/';

forms.forEach(form => form.addEventListener('submit', event => event.preventDefault()));

function Search() {
  const inpValue = document.querySelector('[data-value]').value.toUpperCase();
  const Articles = document.querySelectorAll('[data-state]');

  Articles.forEach((Article) => {
    const Content = Article.querySelector('h2');
    const Title = Content.textContent.toUpperCase() || Content.innerText.toUpperCase();
    
    Title.indexOf(inpValue) > -1 ? Article.style.display = '' : Article.style.display = 'none';
  })
}

function Filter(state) {
  const books = document.querySelectorAll('[data-state]');

  if(state === 'Show All') state = ''
  books.forEach((book) => {
    book.classList.add('Hidden');
    if(book.getAttribute('data-state').indexOf(state) > -1) book.classList.remove('Hidden');
  })
}

function SortAsc() {
  const list = document.querySelector('.Container');
  let switching = true, switchcount = 0, shouldSwitch, dir = "asc", i, c, b;
  while (switching) {
    switching = false;
    c = list.getElementsByTagName("article");
    b = list.querySelectorAll('article .Info h2');
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if (dir === "asc") {
        if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      c[i].parentNode.insertBefore(c[i + 1], c[i]);
      switching = true;
      switchcount++;
    }
  }
}

function SortDesc() {
  const list = document.querySelector('.Container');
  let switching = true, switchcount = 0, shouldSwitch, dir = 'desc', i, c, b;
  while (switching) {
    switching = false;
    c = list.getElementsByTagName("article");
    b = list.querySelectorAll('article .Info h2');
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if (dir === "desc") {
        if (b[i].innerHTML.toLowerCase() < b[i + 1].innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      c[i].parentNode.insertBefore(c[i + 1], c[i]);
      switching = true;
      switchcount++;
    }
  }
}

function SortDirection(way) {
  console.log(way);
  if(way === 'Asc') {
    SortAsc();
  } else if(way === 'Desc') {
    SortDesc();
  }
}

function getData() {
  const databaseRef = ref(database, list);
  onValue(databaseRef, async (snapshot) => {
    Container.innerHTML = '';
    const { Manga } = await import('./components.js');
    Object.values(snapshot.val()).reverse().map((data) => {
      Container.innerHTML += Manga(data);
    })
  })
}


function getManga(Name, Type) {
  const databaseRef = ref(database, reference);
  onValue(databaseRef, async (snapshot) => {
    Container.innerHTML = '';
    const { Volume } = await import('./components.js');
    Object.values(snapshot.val()).reverse().map((data) => {
      if(data.Title === Name.replaceAll('_', ' ') && data.Type === Type.replaceAll('_', ' ')) {
        Container.innerHTML += Volume(data);
      }
    })
  })
}

window.addEventListener('DOMContentLoaded', () => {

  if(WindowPATH === '/' || WindowPATH === '/index.html') {
    getData();

    SearchFilter.Search.addEventListener('keyup', () => Search());

    StateFilterBtns[0].classList.add('active');
    StateFilterBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        StateFilterBtns.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');

        const state = event.target.textContent ||event.target.innerText;
        Filter(state);
      })
    })

    SortingFilterBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        SortingFilterBtns.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');

        const Sort = event.target.textContent || event.target.innerText;
        SortDirection(Sort.split(' ').pop());
      })
    })
  } else if(WindowPATH === '/manga.html' && WindowREF !== '') {
    const typeParam = WindowPARAMS.get('type');
    getManga(WindowREF, typeParam);
  }

})
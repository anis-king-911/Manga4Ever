import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase, ref, onValue
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxJdw2Or76OzVUaAaGSIQ036veT7AlZ00",
  authDomain: "manga4ever-vercel.firebaseapp.com",
  databaseURL: "https://manga4ever-vercel-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "manga4ever-vercel",
  storageBucket: "manga4ever-vercel.appspot.com",
  messagingSenderId: "816513080903",
  appId: "1:816513080903:web:750f10d34d80558ce71b62"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const Container = document.querySelector('.Container');
const form = document.querySelector('form');
let reference = 'Manga4Up/', list = 'List/';

function Search() {
  const inpValue = document.querySelector('[data-value]').value.toUpperCase();
  const Articles = document.querySelectorAll('[data-state]');

  Articles.forEach((Article) => {
    const Content = Article.querySelector('h2');
    const Title = Content.textContent.toUpperCase() || Content.innerText.toUpperCase();
    
    Title.indexOf(inpValue) > -1 ? Article.style.display = '' : Article.style.display = 'none';
  })
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
function getManga(Name) {
  const databaseRef = ref(database, reference);
  onValue(databaseRef, async (snapshot) => {
    Container.innerHTML = '';
    const { Volume } = await import('./components.js');
    Object.values(snapshot.val()).reverse().map((data) => {
      if(data.Title === Name.replaceAll('_', ' ')) {
        Container.innerHTML += Volume(data);
      }
    })
  })
}



const WindowREF = window.location.href.split('/').pop();
const WindowPATH = window.location.pathname;

const theme = document.querySelector('.theme');

window.onload = () => {
  if(WindowPATH === '/' || WindowPATH === '/index.html') {
    getData();

    theme.addEventListener('click', (event) => {
      console.log(document.body.classList.toggle('dark'));
    })
    form.Search.addEventListener('keyup', () => Search());
  } else if(WindowPATH === '/manga.html') {
    getManga(WindowREF);
  }
}




/*
let interval = 300, increment = 1;
Array().forEach((item) => {
  let run = setTimeout(() => {
    console.log(item);

    clearTimeout(run);
  }, interval * increment);
  increment = increment + 1;
})
*/

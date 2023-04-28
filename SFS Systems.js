const SearchFilter = document.querySelector('.SearchFilter');
const StateFilterBtns = document.querySelectorAll('.StateFilter button');
const SortingFilterBtns = document.querySelectorAll('.SortingFilter button');
const TypeFilterBtns = document.querySelectorAll('.TypeFilter button')

/**************************************************/

function Search() {
  const inpValue = document.querySelector('[data-value]').value.toUpperCase();
  const Articles = document.querySelectorAll('[data-state]');

  Articles.forEach((Article) => {
    const Content = Article.querySelector('h2');
    const Title = Content.textContent.toUpperCase() || Content.innerText.toUpperCase();
    
    Title.indexOf(inpValue) > -1 ? Article.style.display = '' : Article.style.display = 'none';
  })
}

function StateFilter(state) {
  const books = document.querySelectorAll('[data-state]');

  if(state === 'Show All') state = ''
  books.forEach((book) => {
    book.classList.add('Hidden');
    if(book.getAttribute('data-state').indexOf(state) > -1) book.classList.remove('Hidden');
  })
}

function TypeFilter(type) {
  const books = document.querySelectorAll('[data-type]');

  if(type === 'Show All') type = ''
  books.forEach((book) => {
    book.classList.add('Hidden');
    if(book.getAttribute('data-type').indexOf(type) > -1) book.classList.remove('Hidden');
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

/**************************************************/

SearchFilter.Search.addEventListener('keyup', () => Search());

StateFilterBtns[0].classList.add('active');
StateFilterBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    StateFilterBtns.forEach(btn => btn.classList.remove('active'));
    btn.classList.add('active');

    const state = event.target.textContent || event.target.innerText;
    StateFilter(state);
  })
})

TypeFilterBtns[0].classList.add('active');
TypeFilterBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    TypeFilterBtns.forEach(btn => btn.classList.remove('active'));
    btn.classList.add('active');

    const Type = event.target.textContent || event.target.innerText;
    TypeFilter(Type);
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
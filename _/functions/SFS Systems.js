function Search() {
  const inpValue = document.querySelector('[data-value]').value.toUpperCase();
  const tableRows = document.querySelectorAll('[data-state]');

  tableRows.forEach((Row) => {
    const Content = Row.querySelector('td:nth-child(3)');
    const Title = Content.textContent.toUpperCase() || Content.innerText.toUpperCase();
    
    Title.indexOf(inpValue) > -1 ? Row.style.display = '' : Row.style.display = 'none';
  })
}

function FilterSelection(label) {
  const books = document.querySelectorAll('[data-state]');
  
  if(label === 'Show All') label = ''
  books.forEach((book) => {
    book.style.display = 'none';
    const state = book.getAttribute('data-state').indexOf(label)>-1;
    if(state) book.style.display = 'table-row';
  })
}

function SortAsc() {
  const list = document.querySelector('.listTbody');
  let switching = true, switchcount = 0, shouldSwitch, dir = "asc", i, c, b;
  while (switching) {
    switching = false;
    c = list.getElementsByTagName("tr");
    b = list.querySelectorAll('tr td:nth-child(3) p:nth-child(1)');
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
  const list = document.querySelector('.listTbody');
  let switching = true, switchcount = 0, shouldSwitch, dir = 'desc', i, c, b;
  while (switching) {
    switching = false;
    c = list.getElementsByTagName("tr");
    b = list.querySelectorAll('tr td:nth-child(3) p:nth-child(1)');
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

function SortById(direction) {
  const list = document.querySelector('.listTbody');
  let i, b, c, shouldSwitch, switching = true;
  while (switching) {
    switching = false;
    c = list.getElementsByTagName("tr");
    b = list.querySelectorAll('tr td:nth-child(2)');
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      
      if(direction === false) {
      
        if (Number(b[i].innerHTML) > Number(b[i + 1].innerHTML)) {
          shouldSwitch = true;
          break;
        }
      
      } else if (direction === true) {
        
        if (Number(b[i].innerHTML) < Number(b[i + 1].innerHTML)) {
          shouldSwitch = true;
          break;
        }
        
      }
      
    }
    if (shouldSwitch) {
      c[i].parentNode.insertBefore(c[i + 1], c[i]);
      switching = true;
    }
  }
}

function SortingWay(way) {
  if(way === 'Asc') {
    SortAsc();
  } else if(way === 'Desc') {
    SortDesc();
  } else if(way === 'ById') {
    idDirection = !idDirection;
    
    SortById(idDirection);
  }
}











//SearchFilter.addEventListener('submit', event => event.preventDefault());
    //SearchFilter.Search.addEventListener('keyup', () => Search());
    /*
    StateFilter.addEventListener('submit', event => event.preventDefault());
    
    StateFilterBtns[0].classList.add('active');
    StateFilterBtns.forEach((Btn) => {
      Btn.addEventListener('click', (event) => {
        StateFilterBtns.forEach(Btn => Btn.classList.remove('active'));
        Btn.classList.add('active');
        const state = event.target.textContent;
        
        FilterSelection(state);
      });
    })
    
    SortingFilter.addEventListener('submit', event => event.preventDefault());
    
    SortingFilterBtns[SortingFilterBtns.length-1].classList.add('active');
    SortingFilterBtns.forEach((Btn) => {
      Btn.addEventListener('click', (event) => {
        SortingFilterBtns.forEach(Btn => Btn.classList.remove('active'));
        Btn.classList.add('active');
        const Way = event.target.textContent.split(' ').pop();
    
        SortingWay(Way);
      });
    })
    */
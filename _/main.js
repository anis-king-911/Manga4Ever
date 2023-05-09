const WindowPath = window.location.pathname;
const WindowSearch =  window.location.search;
const WindowParams = new URLSearchParams(WindowSearch);
const WindowTitle = WindowParams.has('title') ? WindowParams.get('title').replaceAll('_', ' ') : null;
const WindowType = WindowParams.has('type') ? WindowParams.get('type').replaceAll('_', ' ') : null;

const allForms = document.querySelectorAll('form');
const MangaForm = document.querySelector('.MangaForm');
const VolumeForm = document.querySelector('.VolumeForm');

const MangaTable = document.querySelector('.MangaTable');
const VolumeTable = document.querySelector('.VolumeTable');

const lmpMangaBtn = document.querySelector('.lmp button.Manga');
let MangaPageIndex = 1, VolumePageIndex = 1;


/*
const MangaUpdateForm = document.querySelector('.MangaUpdateForm');
const VolumeUpdateForm = document.querySelector('.VolumeUpdateForm');
const lmpVolumeBtn = document.querySelector('.lmp button.Volume');
const ItemsCount = document.querySelector('.ItemsCount');
const paginationBtns = document.querySelectorAll('.Pagination button');
const PagesNumber = document.querySelector('.PagesNumber');
const SearchFilter = document.querySelector('.SearchFilter');
const StateFilter = document.querySelector('.StateFilter');
const StateFilterBtns = StateFilter?.querySelectorAll('button');
const SortingFilter = document.querySelector('.SortingFilter');
const SortingFilterBtns = SortingFilter?.querySelectorAll('button');
*/

async function fetchInputs() {
  const opt = (item) => `<option value="${item}">${item}</option>`;
  
  const TitlesApi = 'https://api4ever.vercel.app/titles';
  const TitlesRes = await fetch(TitlesApi).then(res => res.json());

  const _MTitles = MangaForm.querySelector('#Titles');
  const _VTitles = VolumeForm.querySelector('#Titles');
  
  TitlesRes.map((item) => {
    _MTitles.innerHTML += opt(item);
    _VTitles.innerHTML += opt(item);
  });
  
  //const MagazinesApi = 'https://api4ever.vercel.app/magazines';
  //const MagazinesRes = await fetch(MagazinesApi).then(res => res.json());  
  //const _Magazines = MangaForm.querySelector('#Magazines');
  
  //console.log([...new Set(MagazinesRes)].length);
  //[...new Set(MagazinesRes)].sort().map(item => _Magazines.innerHTML += opt(item))
}

window.addEventListener('DOMContentLoaded', async (event) => {
  allForms.forEach(form => form.addEventListener('submit', event => event.preventDefault()));
  
  if(WindowPath === '/_/' || WindowPath === '/_/index.html') {
    const { FormsID } = await import('./functions/FormsID.js');
    FormsID(MangaForm, VolumeForm);
    fetchInputs();

    MangaForm.addEventListener('submit', async (event) => {
      const { MangaUpload } = await import('./functions/upload/manga.js');
      const { Manga } = await import('./functions/components.js');

      const newManga = new Manga(MangaForm, {
        Title: MangaForm.Title.value,
        Cover: MangaForm.Cover.value,
        State: MangaForm.State.value,
        Type: MangaForm.Type.value,
        VolCount: MangaForm.VolCount.value,
        Magazine: MangaForm.Magazine.value,
        PubAt: MangaForm.PubAt.value
      });
    
      MangaUpload(newManga);
      MangaForm.reset();
    })
    
    VolumeForm.addEventListener('submit', async (event) => {
      const { VolumeUpload } = await import('./functions/upload/volume.js');
      const { Volume } = await import('./functions/components.js');

      const newVolume = new Volume(VolumeForm, {
        Title: VolumeForm.Title.value,
        VolNumber: VolumeForm.VolNumber.value,
        Cover: VolumeForm.Cover.value,
        Type: VolumeForm.Type.value,
        PubAt: VolumeForm.PubAt.value
      });
    
      VolumeUpload(newVolume);
      VolumeForm.reset();
    })
    
    const { MangaRead } = await import('./functions/read/manga.js');
    MangaRead(MangaTable, MangaPageIndex);
    lmpMangaBtn.addEventListener('click', () => MangaRead(MangaTable, (MangaPageIndex++)+1));

    const { VolumeRead } = await import('./functions/read/volume.js');
    VolumeRead(VolumeTable, VolumePageIndex);
    //lmpVolumeBtn.addEventListener('click', () => VolumeRead(VolumeTable, (VolumePageIndex++)+1, ItemsCount));
    
    /*
    paginationBtns.forEach((button) => {
      button.addEventListener('click', (event) => {
        if(direction.includes('new')) {
          VolumeRead(VolumeTable, (VolumePageIndex++)+1);
        }
        
        if(direction.includes('old')) {
          VolumeRead(VolumeTable, (VolumePageIndex--)-1);
        }
        
        //*** const Direction = event.target;
        //*** VolumeRead(VolumeTable, VolumePageIndex, Direction);
      })
    })
    */
    
  } else if(WindowPath === '/_/manga.html') {
    
    const { SoloRead } = await import('./functions/read/solo.js');
    SoloRead(MangaTable, { title: WindowTitle, type: WindowType });
  }
});
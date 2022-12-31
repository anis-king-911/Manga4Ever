/*
function GetListV2() {
  const databaseRef = ref(database, reference);

  onValue(databaseRef, async (snapshot) => {
    const snaps = Object.values(snapshot.val());
    const newSnaps = [...new Map(snaps.map((m) => [m.Title, m])).values()];

    console.log(newSnaps);
  })
}
*/

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

/*
let time = 1000, timeCount = 0;
let testRun = setInterval(() => {
  timeCount++;
  document.querySelector('.OldDataBtn').click();
  console.log(timeCount);
  timeCount === 20 ? clearInterval(testRun) : '';
}, time);

function namesChrck() {
  const databaseRef = ref(database, reference);

  onValue(databaseRef, snapshot => {
    const Snaps = Object.values(snapshot.val());
    const Names = Snaps.map(Snap => Snap.Title);
    const Wanted = Names.filter(name => name === '');

    console.log(Wanted);
  })
}

namesChrck();
*/
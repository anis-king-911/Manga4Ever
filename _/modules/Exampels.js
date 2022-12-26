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
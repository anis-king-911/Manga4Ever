import { MainList, database, ref, child, onValue } from 'firebase';

function OpenMangaEdit(form, id) {
  const databaseRef = ref(database, MainList);
  const databaseChild = child(databaseRef, `${id}`);

  onValue(databaseChild, (snapshot) => {
    const { Title, Cover, VolCount, State, Type, Dates, Magazine } = snapshot.val();

    form.Title.value = Title;
    form.VolCount.value = VolCount;
    form.Cover.value = Cover;
    form.State.value = State;
    form.Type.value = Type;
    form.Magazine.value = Magazine;
    form.PubAt.value = new Date(Dates['PubAt']).toISOString().split('Z').shift();
  })
}

export { OpenMangaEdit }
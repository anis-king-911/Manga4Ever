import { CoversList, database, ref, child, onValue } from 'firebase';

function OpenVolumeEdit(form, id) {
  const databaseRef = ref(database, CoversList);
  const databaseChild = child(databaseRef, `${id}`);

  onValue(databaseChild, (snapshot) => {
    const { Title, VolNumber, Cover, Type, Dates } = snapshot.val();

    form.Title.value = Title;
    form.VolNumber.value = VolNumber;
    form.Cover.value = Cover;
    form.Type.value = Type;
    form.PubAt.value = new Date(Dates['PubAt']).toISOString().split('Z').shift();
  })
}

export { OpenVolumeEdit }
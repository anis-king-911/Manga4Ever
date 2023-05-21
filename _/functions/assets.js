const StateBg = {
  'Publishing': '#4ade80',
  'Finished': '#60a5fa',
  'Discontinued': '#f87171',
  'On Hiatus': '#facc15',
};

const States = ['Publishing', 'Finished', 'Discontinued', 'On Hiatus'];
const Types = ['Manga', 'Light Novel', 'One Shot'];

const toDigits = (x,n) => Number(x).toLocaleString('en-US', {minimumIntegerDigits: Number(n)})
const toDates = (x,t) => new Date(x).toLocaleDateString('en-US', {dateStyle: String(t)})

export { StateBg, States, Types, toDigits, toDates }
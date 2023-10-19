const express = require("express");
const port = 3000;
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.static('./public/assets'));

app.get('/', (req, res) => {
  res.sendFile('./public/index.html', { root: __dirname });
});

app.get('/manga', (req, res) => {
  res.sendFile('./public/manga.html', { root: __dirname });
  
  console.log({
    title: req.query.title,
    type: req.query.type
  })
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`)
});

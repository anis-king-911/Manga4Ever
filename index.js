const express = require("express");
const path = require('path');
const port = 3000;
const app = express();

app.use("/assets", express.static(path.resolve(__dirname, "public", "assets")));
//app.use(express.static('./public/assets'));

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

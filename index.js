const express = require('express');
const app = express();

app.use(express.static('public'));

app.post('/add', (req, res) => {
  res.json({status: 'success'});
});

app.post('/get', (req, res) => {
  res.json({status: 'success'});
});

app.post('/delete', (req, res) => {
  res.json({status: 'success'});
});

app.post('/showAll', (req, res) => {
  res.json({status: 'success'});
});

app.listen(3000, function(){
  console.log("Listening on port 3000!")
});
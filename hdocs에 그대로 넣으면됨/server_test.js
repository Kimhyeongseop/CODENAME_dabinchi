const express = require('express');
const app = express();
const port = 3080;

app.get('/', function(req, res){
    res.send('Hello World');
});

app.listen(port, 'localhost',() => console.log('listening to 3080!'));
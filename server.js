var express = require('express');
var logger = require('connect-logger');
var http = require('http');

var app = express();
app.use(require('skipper')());
app.use('/web', express.static(__dirname+'/web'));
app.use(logger());

app.get('/', function(req, res){
  res.redirect('/index.html');
})

app.post('/uploadform', function(req, res){
  req.file('file1').upload(function (err, uploadedFiles){
    if (err) return res.send(500, err);
    return res.send(200, uploadedFiles);
  })
})

http.createServer(app).listen(3000, function(){
  console.log('Listening for file uploads on 3000');
})
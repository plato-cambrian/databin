var express = require('express');
var logger = require('connect-logger');
var http = require('http');
var skipper = require('skipper');
var skipperS3 = require('skipper-s3');
var cfgLocals = require('./assertLocals.js');

var app = express();
app.use(skipper());
app.use(logger());
app.use(express.static(__dirname+'/web'));

app.get('/', function(req, res){
  res.redirect('/index.html');
})

app.post('/uploadform', function(req, res){
  req.file('file1')
  .upload(function (err, uploadedFiles){
    if (err) return res.send(500, err);
    return res.send(200, uploadedFiles);
  })

})
app.post('/uploadS3', function(req, res){
  req.file('file2')
  .upload({
    // ...any other options here...
    adapter: skipperS3,
    key: cfgLocals.accessKeyId,
    secret: cfgLocals.secretAccessKey,
    endpoint: 's3.amazonaws.com',
    bucket: 'ships.databin'
  }, function(err, uploadedFiles){
    if (err) return res.send(500, err);
    var loc = uploadedFiles[0].extra.Location;
    return res.status(200).redirect(loc);
  })
})

http.createServer(app).listen(3000, function(){
  console.log('Listening for file uploads on 3000');
})
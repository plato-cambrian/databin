var express = require('express');
var logger = require('connect-logger');
var http = require('http');
var skipper = require('skipper');
var fs = require('fs');

try{
  fs.readFileSync('./locals.js', {encoding: 'utf8'});
} catch(e){
  console.log('Set your AWS/S3 api keys in cfg/locals.js')
  var locals = {
    accessKeyId : 'AAAAAAAAAAAAAAAAAAAA',
    secretAccessKey: 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    region: 'us-east-1',
  };
  locals = JSON.stringify(locals, null, 2);
  fs.writeFileSync('./locals.js', locals, {encoding: 'utf8'});
  process.exit();
}

var app = express();
app.use(skipper());
app.use(logger());
app.use(express.static(__dirname+'/web'));

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
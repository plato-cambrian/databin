var express = require('express');
var logger = require('connect-logger');
var http = require('http');
var skipper = require('skipper');
var skipperS3 = require('skipper-s3');
var cfgLocals = require('./assertLocals.js');
var myS3 = require('./myS3.js')(cfgLocals);

var app = express();
app.use(skipper());
app.use(logger());
app.use(express.static(__dirname+'/web'));
app.use(express.static(__dirname+'/.tmp/uploads'));

app.get('/', function(req, res){
  res.redirect('/index.html');
})

app.post('/uploadform', function(req, res){
  req.file('file1')
  .upload({
    saveAs: 'background.img'
  },function (err, uploadedFiles){
    if (err) return res.send(500, err);
    res.redirect('/index.html');
  })

})
app.post('/uploadS3', function(req, res){
  req.file('file2')
  .upload({
    // ...any other options here...
    adapter: skipperS3,
    key: cfgLocals.accessKeyId,
    secret: cfgLocals.secretAccessKey,
    endpoint: cfgLocals.endpoint,
    bucket: cfgLocals.bucket,
  }, function(err, uploadedFiles){
    console.log(uploadedFiles);
    var loc = uploadedFiles[0].extra.Location;
    // skipper-s3 does not set an ACL policy:
    var opts = {
      Key: uploadedFiles[0].extra.Key,
    }
    myS3.makePublic(opts, function(err, info){
      console.log(info);
      if (err){
       console.log(err);
       return res.send(500, err);
      }
      return res.status(200).redirect(loc);
    })
  })
})

http.createServer(app).listen(3000, function(){
  console.log('Listening for file uploads on 3000');
})
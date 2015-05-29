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
  locals = "module.exports = " + locals;
  fs.writeFileSync('./locals.js', locals, {encoding: 'utf8'});
  process.exit();
}
module.exports = require('./locals.js');
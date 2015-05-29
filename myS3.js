var AWS = require('aws-sdk');
module.exports = function(cfgLocals){
  console.log(cfgLocals);
  AWS.config.update({
    accessKeyId: cfgLocals.accessKeyId,
    secretAccessKey: cfgLocals.secretAccessKey,
    region: cfgLocals.region,
    sslEnabled: true,
  });
  var s3 = new AWS.S3({endpoint: 's3.amazonaws.com'});

  var myS3 = {};
  myS3.makePublic = function(opts, callback){
    var params = {
      Bucket: cfgLocals.bucket, /* required */
      Key: opts.Key, /* required */
      ACL: 'public-read',
      //ACL: 'private | public-read | public-read-write | authenticated-read | bucket-owner-read | bucket-owner-full-control',
    };
    s3.putObjectAcl(params,callback);
  }
  return myS3;
}

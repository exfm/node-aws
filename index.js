var cloudsearch = require('./lib/services/cs'),
    s3 = require('./lib/services/s3'),
    ses = require('./lib/services/ses');


function AWS(){}

AWS.prototype.connect = function(accessKeyId, secretAccessKey){
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.cloudsearch = new cloudsearch.CloudSearch(accessKeyId, secretAccessKey);
    this.s3 = new s3.S3(accessKeyId, secretAccessKey);
    this.ses = new ses.SES(accessKeyId, secretAccessKey);
    return this;
};

module.exports = new AWS();

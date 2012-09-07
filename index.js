"use strict";

var fs = require('fs'),
    cloudsearch = require('./lib/services/cloud-search'),
    s3 = require('./lib/services/s3'),
    ses = require('./lib/services/ses'),
    sqs = require('./lib/services/sqs'),
    CloudWatch = require('./lib/services/cloud-watch');


function AWS(){}

AWS.prototype.connect = function(opts){
    opts = opts || {};

    var key = process.env.AWS_KEY,
        secret = process.env.AWS_SECRET,
        data;

    if(opts.file){
        data = JSON.parse(fs.readFileSync(opts.file));
        key = data.key;
        secret = data.secret;
    }

    this.accessKeyId = key;
    this.secretAccessKey = secret;

    this.s3 = new s3.S3(key, secret);
    this.ses = new ses.SES(key, secret);
    this.sqs = new sqs.SQS(key, secret);

    this.cloudSearch = new cloudsearch.CloudSearch(key, secret);
    this.cloudWatch = new CloudWatch(key, secret);
    return this;
};

module.exports = new AWS();

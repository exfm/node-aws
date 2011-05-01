var
  util = require('util'),
  s3 = require('../S3'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * GET Service
 *
 * @param   {Object}  args
 */
var Request = function(args) {
  s3.Request.call(this, Response, args, 'GET', '/', true);
}

util.inherits(Request, s3.Request);

/**
 * ListAllMyBucketsResult
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = function(headers, data) {
  s3.Response.call(this, headers, data);

  var self    = this;
  var xmlRoot = self._xml.get('/ListAllMyBucketsResult');
  var owner   = _.xmlToJson(xmlRoot.get('./Owner'));
  self.owner  = {
    id: owner.ID,
    displayName: owner.DisplayName,
  }

  var xmlBuckets  = xmlRoot.find('./Buckets/Bucket');
  self.buckets    = [];

  for (var i in xmlBuckets) {
    var bucket = _.xmlToJson(xmlBuckets[i]);

    self.buckets.push({
      name: bucket.Name,
      creationDate: new Date(bucket.CreationDate),
    });
  }
}

util.inherits(Response, s3.Response);

module.exports.Request  = Request;
module.exports.Response = Response;
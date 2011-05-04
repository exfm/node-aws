var
  util = require('util'),
  s3 = require('../s3'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET Service
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  s3.Request.call(this, args, 'GET');
}

util.inherits(Request, s3.Request);

/**
 * ListAllMyBucketsResult
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  s3.Response.call(this, response);

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
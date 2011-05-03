var
  util = require('util'),
  s3 = require('../S3'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * DELETE Object
 *
 * @param   {Object}  args
 */
var Request = function(args) {
  s3.Request.call(this, Response, args, 'DELETE');

  var self    = this;
  args.bucket = _.asString(args.bucket);

  if (0 == args.bucket.length) {
    throw new aws.Exception('args.bucket must be a string', 'InvalidBucketName');
  }

  self._path += args.bucket;
  args.key    = _.asString(args.key);

  if (0 == args.key.length) {
    throw new aws.Exception('args.key must be a string', 'InvalidArgument');
  }

  // escape key?
  self._path += '/' + args.key.replace(/^\//, '');

  if (null != args.mfa) {
    self._headers['x-amz-mfa'] = _.asString(args.mfa);
  }
}

util.inherits(Request, s3.Request);

/**
 * DELETE Object
 *
 * @param   {Object}  response
 */
var Response = function(response) {
  s3.Response.call(this, response);

  var self          = this;
  self.deleteMarker = _.asBoolean(response.headers['x-amz-delete-marker']);
  self.versionId    = response.headers['x-amz-version-id'];
}

util.inherits(Response, s3.Response);

module.exports.Request  = Request;
module.exports.Response = Response;
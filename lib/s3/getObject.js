var
  util = require('util'),
  s3 = require('../s3'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * PUT Object
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  s3.Request.call(this, args, 'GET');

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

  if (null != args.versionId) {
    self._query['versionId'] = _.asString(args.versionId);
  }

  if (null != args.range) {
    self._headers['Range'] = _.asString(args.range);
  }

  if (null != args.ifModifiedSince) {
    self._headers['If-Modified-Since'] = _.asDate(args.ifModifiedSince);
  }

  if (null != args.ifUnmodifiedSince) {
    self._headers['If-Unmodified-Since'] = _.asDate(args.ifUnmodifiedSince);
  }

  if (null != args.ifMatch) {
    self._headers['If-Match'] = '"' + _.asString(args.ifMatch) + '"';
  }

  if (null != args.ifNoneMatch) {
    self._headers['If-None-Match'] = '"' + _.asString(args.ifNoneMatch) + '"';
  }
}

util.inherits(Request, s3.Request);

/**
 * PUT Object
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  s3.Response.call(this, response);

  var self          = this;
  self.versionId    = response.headers['x-amz-version-id'];
  self.deleteMarker = _.asBoolean(response.headers['x-amz-delete-marker']);
  self.eTag         = response.headers['etag'].replace(/"/g, "");
  self.lastModifed  = _.asDate(response.headers['last-modified']);
  self.contentType  = response.headers['content-type'];
  self.content      = response.data;
}

util.inherits(Response, s3.Response);
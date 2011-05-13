var
  util = require('util'),
  crypto = require('crypto'),
  s3 = require('../s3'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * PUT Object
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  s3.Request.call(this, args, 'PUT');

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

  if (null != args.content) {
    self._content                   = _.asString(args.content);
    self._headers['Content-Length'] = self._content.length;
    self._headers['Content-MD5']    = crypto.createHash('md5').update(self._content).digest('base64');
  } else {
    self._headers['Content-Length'] = 0;
    self._headers['Content-MD5']    = null;
  }

  if (null != args.cacheControl) {
    self._headers['Cache-Control'] = _.asString(args.cacheControl);
  }

  if (null != args.contentDisposition) {
    self._headers['Content-Disposition'] = _.asString(args.contentDisposition);
  }

  if (null != args.contentEncoding) {
    self._headers['Content-Encoding'] = _.asString(args.contentEncoding);
  }

  if (null != args.contentType) {
    self._headers['Content-Type'] = _.asString(args.contentType);
  } else {
    // Override the default "text/xml; charse=utf-8" set in RestRequest.
    self._headers['Content-Type'] = null;
  }

  if (null != args.expect) {
    self._headers['Expect'] = _.asString(args.expect);
  }

  if (null != args.expires) {
    self._headers['Expires'] = _.asString(args.expires);
  }

  if (null != args.acl) {
    self._headers['x-amz-acl'] = _.asString(args.acl);
  }

  if (_.isObject(args.metadata)) {
    for (var name in args.metadata) {
      self._headers['x-amz-meta-' + name] = _.asString(args.metadata[name]);
    }
  }

  if (null != args.storageClass) {
    self._headers['x-amz-storage-class'] = _.asString(args.storageClass);
  }
}

util.inherits(Request, s3.Request);

/**
 *
 * @return  {String}
 */
Request.prototype.getBody = function() {
  return this._content;
}

/**
 * PUT Object
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  s3.Response.call(this, response);

  var self        = this;
  self.eTag       = response.headers['etag'].replace(/"/g, "");
  self.versionId  = response.headers['x-amz-version-id'];
}

util.inherits(Response, s3.Response);
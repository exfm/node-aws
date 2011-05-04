var
  util = require('util'),
  libxmljs = require('libxmljs'),
  s3 = require('../s3'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * PUT Bucket
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  s3.Request.call(this, args, 'PUT', '/');

  var self    = this;
  args.bucket = _.asString(args.bucket);

  if (0 == args.bucket.length) {
    throw new aws.Exception('args.bucket must be a string', 'InvalidBucketName');
  }

  self._path += args.bucket;

  if (null != args.acl) {
    self._headers['x-amz-acl'] = _.asString(args.acl);
  }

  if (null != args.locationConstraint) {
    self._xml   = new libxmljs.Document();
    var xmlRoot = self._xml.node('CreateBucketConfiguration');

    xmlRoot.namespace(s3.xmlns);
    xmlRoot.node('LocationConstraint').text(_.asString(args.locationConstraint));
  }
}

util.inherits(Request, s3.Request);

/**
 * PUT Bucket
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = s3.Response;
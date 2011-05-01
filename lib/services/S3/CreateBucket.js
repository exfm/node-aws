var
  util = require('util'),
  libxmljs = require('libxmljs'),
  s3 = require('../S3'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * PUT Bucket
 *
 * @param   {Object}  args
 */
var Request = function(args) {
  s3.Request.call(this, Response, args, 'PUT', '/');

  var self = this;

  if (null != args.acl) {
    if (!_.isString(args.acl)) {
      throw new Error('args.acl must be a string or null');
    }

    self._headers['x-amz-acl'] = args.acl;
  }

  if (null != args.locationConstraint) {
    if (!_.isString(args.locationConstraint)) {
      throw new Error('args.locationConstraint must be a string or null');
    }

    self._xml   = new libxmljs.Document();
    var xmlRoot = self._xml.node('CreateBucketConfiguration');

    xmlRoot.namespace(s3.xmlns);
    xmlRoot.node('LocationConstraint').text(args.locationConstraint);
  }
}

util.inherits(Request, s3.Request);

/**
 * PUT Bucket
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = function(headers, data) {
  s3.Response.call(this, headers, data);
}

util.inherits(Response, s3.Response);

module.exports.Request  = Request;
module.exports.Response = Response;
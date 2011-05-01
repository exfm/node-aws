var
  util = require('util'),
  s3 = require('../S3'),
  aws = require('../../aws');

/**
 * DELETE Bucket
 *
 * @param   {Object}  args
 */
var Request = function(args) {
  s3.Request.call(this, Response, args, 'DELETE', '/');
}

util.inherits(Request, s3.Request);

/**
 * DELETE Bucket
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
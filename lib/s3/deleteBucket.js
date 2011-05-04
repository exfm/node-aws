var
  util = require('util'),
  s3 = require('../s3'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * DELETE Bucket
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  s3.Request.call(this, args, 'DELETE');

  var self    = this;
  args.bucket = _.asString(args.bucket);

  if (0 == args.bucket.length) {
    throw new aws.Exception('args.bucket must be a string', 'InvalidBucketName');
  }

  self._path += args.bucket;
}

util.inherits(Request, s3.Request);

/**
 * DELETE Bucket
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = s3.Response;
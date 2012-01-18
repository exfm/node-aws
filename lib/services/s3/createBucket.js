var s3 = require('../s3');

/**
 * PUT Bucket
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method  = 'PUT';
  request.path   += args.bucket;

  if ('undefined' !== typeof args.acl) {
    request.headers['x-amz-acl'] = args.acl;
  }

  if ('undefined' !== typeof args.locationConstraint) {
    var xmlRoot = request.xml('CreateBucketConfiguration', s3.xmlns).root();

    xmlRoot.node('LocationConstraint').text(args.locationConstraint);
  }
}

/**
 * PUT Bucket
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
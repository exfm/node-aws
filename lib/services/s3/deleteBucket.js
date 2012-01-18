/**
 * DELETE Bucket
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method  = 'DELETE';
  request.path   += args.bucket;
};

/**
 * DELETE Bucket
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
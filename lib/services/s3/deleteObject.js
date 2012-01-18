/**
 * DELETE Object
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method  = 'DELETE';
  request.path   += args.bucket;
  request.path   += '/' + args.key;

  if ('undefined' !== typeof args.versionId) {
    request.query['versionId'] = args.versionId;
  }

  if ('undefined' !== typeof args.mfa) {
    request.headers['x-amz-mfa'] = args.mfa;
  }
}

/**
 * DELETE Object
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  if ('undefined' !== typeof response.headers['x-amz-version-id']) {
    response.data.versionId = response.headers['x-amz-version-id'];
  }

  if ('undefined' !== typeof response.headers['x-amz-delete-marker']) {
    response.data.deleteMarker = 'true' === response.headers['x-amz-delete-marker'];
  }
}
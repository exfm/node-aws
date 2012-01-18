/**
 * GET Object
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method  = 'GET';
  request.path   += args.bucket;
  request.path   += '/' + args.key;

  if ('undefined' !== typeof args.versionId) {
    request.query['versionId'] = args.versionId;
  }

  if ('undefined' !== typeof args.range) {
    request.headers['Range'] = args.range;
  }

  if ('undefined' !== typeof args.ifModifiedSince) {
    request.headers['If-Modified-Since']  = (args.ifModifiedSince instanceof Date)
                                          ? args.ifModifiedSince.toUTCString()
                                          : args.ifModifiedSince;
  }

  if ('undefined' !== typeof args.ifUnmodifiedSince) {
    request.headers['If-Unmodified-Since']  = (args.ifUnmodifiedSince instanceof Date)
                                            ? args.ifUnmodifiedSince.toUTCString()
                                            : args.ifUnmodifiedSince;
  }

  if ('undefined' !== typeof args.ifMatch) {
    request.headers['If-Match'] = args.ifMatch;
  }

  if ('undefined' !== typeof args.ifNoneMatch) {
    request.headers['If-None-Match'] = args.ifNoneMatch
  }
}

/**
 * GET Object
 *
 * @param   {Object}  response
 */
module.exports.decodeResponse = function(response) {
  response.data.eTag         = response.headers['etag'];
  response.data.lastModifed  = new Date(response.headers['last-modified']);
  response.data.content      = response.body;
  response.data.contentType  = response.headers['content-type'];

  if ('undefined' !== typeof response.headers['content-length']) {
    response.data.contentLength = parseeInt(response.headers['content-length']);
  }

  if ('undefined' !== typeof response.headers['content-range']) {
    response.data.contentRange = response.headers['content-range'];
  }

  if ('undefined' !== typeof response.headers['x-amz-version-id']) {
    response.data.versionId = response.headers['x-amz-version-id'];
  }

  if ('undefined' !== typeof response.headers['x-amz-delete-marker']) {
    response.data.deleteMarker = 'true' === response.headers['x-amz-delete-marker'];
  }

  if ('undefined' !== typeof response.headers['x-amz-expiration']) {
    response.data.expiration = response.parseExpiration(response.headers['x-amz-expiration']);
  }
}
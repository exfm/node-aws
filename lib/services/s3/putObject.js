var crypto = require('crypto');

/**
 * PUT Object
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method  = 'PUT';
  request.path   += args.bucket;
  request.path   += '/' + args.key;

  if ('undefined' !== typeof args.content) {
    request.headers['Content-Length'] = args.content.length;
    request.headers['Content-MD5']    = crypto.createHash('md5').update(args.content).digest('base64');
  } else {
    request.headers['Content-Length'] = 0;
    request.headers['Content-MD5']    = '';
  }

  if ('undefined' !== typeof args.cacheControl) {
    request.headers['Cache-Control'] = args.cacheControl;
  }

  if ('undefined' !== typeof args.contentDisposition) {
    request.headers['Content-Disposition'] = args.contentDisposition;
  }

  if ('undefined' !== typeof args.contentEncoding) {
    request.headers['Content-Encoding'] = args.contentEncoding;
  }

  if ('undefined' !== typeof args.contentType) {
    request.headers['Content-Type'] = args.contentType;
  } else {
    // Override the default "text/xml; charse=utf-8" set in RestRequest.
    request.headers['Content-Type'] = null;
  }

  if ('undefined' !== typeof args.expect) {
    request.headers['Expect'] = args.expect;
  }

  if ('undefined' !== typeof args.expires) {
    request.headers['Expires'] = args.expires;
  }

  if ('undefined' !== typeof args.acl) {
    request.headers['x-amz-acl'] = args.acl;
  }

  if (args.metadata instanceof Object) {
    for (var name in args.metadata) {
      request.headers['x-amz-meta-' + name] = args.metadata[name];
    }
  }

  if ('undefined' !== typeof args.serverSideEncryption) {
    request.headers['x-amz-server-side-encryption'] = args.serverSideEncryption;
  }

  if ('undefined' !== typeof args.storageClass) {
    request.headers['x-amz-storage-class'] = args.storageClass;
  }

  // This is a total hack and needs to be re-thought.
  request.getBody = function() {
    return args.content || '';
  };
}

/**
 * PUT Object
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  response.data.eTag = response.headers['etag'];

  if ('undefined' !== typeof response.headers['x-amz-server-side-encryption']) {
    response.data.serverSideEncryption = response.headers['x-amz-server-side-encryption'];
  }

  if ('undefined' !== typeof response.headers['x-amz-version-id']) {
    response.data.versionId = response.headers['x-amz-version-id'];
  }

  if ('undefined' !== typeof response.headers['x-amz-expiration']) {
    response.data.expiration = response.parseExpiration(response.headers['x-amz-expiration']);
  }
}
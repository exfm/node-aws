var
  util = require('util'),
  crypto = require('crypto'),
  aws = require('../aws'),
  _ = require('../util');

// Version Information
var version = '2006-03-01';
var xmlns   = 'http://doc.s3.amazonaws.com/' + version + '/';

/**
 * A generic S3 request.
 *
 * @param   {Function}  response
 * @param   {String}    action
 */
var Request = function(response, args, method, path, ignoreBucket) {
  if (null != args.bucket || true != ignoreBucket) {
    if (!_.isString(args.bucket)) {
      throw new Error('args.bucket must be a string');
    }

    if (null != args.bucket) {
      path = '/' + args.bucket + path;
    }
  }

  aws.RestRequest.call(this, response, args, 's3.amazonaws.com', method, path);
}

util.inherits(Request, aws.RestRequest);

/**
 * Returns the signature headers for the request.
 *
 * @return  {Object}
 */
Request.prototype._getSignatureHeaders = function() {
  var self    = this
  var headers = aws.RestRequest.prototype._getSignatureHeaders.call(self);

  if (!self.isSigned()) {
    return headers;
  }

  var content = self.getBody();
  var md5     = '';

  if (0 < content.length) {
    md5 = crypto.createHash('md5').update(content).digest('hex');
  }

  var amzHeaders        = {};
  var amzHeadersSorted  = [];

  for (var name in self._headers) {
    if (0 != name.toLowerCase().indexOf('x-amz-')) {
      continue;
    }

    amzHeaders[name.toLowerCase()] = name;

    amzHeadersSorted.push(name.toLowerCase());
  }

  amzHeadersSorted.sort();

  for (var i in amzHeadersSorted) {
    var name  = amzHeadersSorted[i];
    var value = self._headers[amzHeaders[name]];
    value     = value.replace(/[\r\n]/g, ' ');

    amzHeadersSorted[i] = name + ':' + value + "\n";
  }

  var hmac      = crypto.createHmac('sha1', self._secretAccessKey);
  var signature = self._method + "\n"
                + md5 + "\n"
                + self._headers['Content-Type'] + "\n"
                + self._date.toUTCString() + "\n"
                + amzHeadersSorted.join()
                + self._path;
  signature     = hmac.update(signature).digest('base64');

  headers['Authorization']  = 'AWS ' + self._accessKeyId + ':' + signature;

  return headers;
}

/**
 * A generic S3 response.
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = function(headers, data) {
  aws.Response.call(this, headers, data);

  var self = this;

  if (self._xml) {
    var error = _.xmlToJson(self._xml.get('/Error'));

    if (error) {
      throw new aws.ResponseError(
        error.RequestId,
        error.Message,
        error.Code
      );
    }
  }

  self.requestId = self._headers['x-amz-request-id'];
}

util.inherits(Response, aws.Response);

module.exports.version        = version;
module.exports.xmlns          = xmlns;
module.exports.Request        = Request;
module.exports.Response       = Response;
module.exports.createRequest  = function(method, args) {
  var method;

  try {
    method = require('./S3/' + method);
  } catch (e) {
    throw new Error(method + ' is not a valid S3 method');
  }

  return new method.Request(args);
}
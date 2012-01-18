var
  util = require('util'),
  crypto = require('crypto'),
  aws = require('../aws');

// Version Information
var version         = '2006-03-01';
var xmlns           = 'http://doc.s3.amazonaws.com/' + version + '/';
var defaultEndpoint = 's3.amazonaws.com';
var methods         = [
  'createBucket',
  'deleteBucket',
  'deleteObject',
  'getObject',
  'listAllMyBuckets',
  'listBucket',
  'putObject',
];

/**
 * A generic S3 request.
 *
 * @param   {String}  endpoint
 */
var Request = function(endpoint) {
  aws.RestRequest.call(this);

  var self  = this;
  self.host = endpoint || defaultEndpoint;
}

util.inherits(Request, aws.RestRequest);

/**
 * Returns the string to sign.
 *
 * @param   {String}  accessKeyId
 * @return  {String}
 */
Request.prototype.getStringToSign = function(accessKeyId) {
  var self        = this;
  var content     = self.getBody();
  var md5         = '';

  if (0 < content.length) {
    md5 = crypto.createHash('md5').update(content).digest('base64');
  }

  var amzHeaders        = {};
  var amzHeadersSorted  = [];

  for (var name in self.headers) {
    if (0 != name.toLowerCase().indexOf('x-amz-')) {
      continue;
    }

    amzHeaders[name.toLowerCase()] = name;

    amzHeadersSorted.push(name.toLowerCase());
  }

  amzHeadersSorted.sort();

  amzHeadersSorted.forEach(function(name) {
    var name  = amzHeadersSorted[i];
    var value = self.headers[amzHeaders[name]];
    value     = value.replace(/[\r\n]/g, ' ');

    amzHeadersSorted[i] = name + ':' + value + "\n";
  });

  var stringToSign  = self.method + "\n"
                    + md5 + "\n"
                    + (self.headers['Content-Type'] || '') + "\n"
                    + self.date.toUTCString() + "\n"
                    + amzHeadersSorted.join()
                    + self.path;

  return stringToSign;
}

/**
 * Signs the request with the given key and signature.
 *
 * @param   {String}  accessKeyId
 * @param   {String}  signature
 * @return  {Request}
 */
Request.prototype.sign = function(accessKeyId, signature) {
  aws.RestRequest.prototype.sign.call(this, accessKeyId, signature);

  this.headers['Authorization'] = 'AWS ' + accessKeyId + ':' + signature;

  return this;
}

/**
 * A generic S3 response.
 *
 * @param   {Object}  httpResponse
 */
var Response = function(httpResponse) {
  aws.Response.call(this, httpResponse);

  var self = this;

  if (self.xml) {
    var error = self.xmlToJson(self.xml.get('/Error'));

    if (error) {
      throw new aws.ResponseException(
        error.Message,
        error.Code,
        error.RequestId
      );
    }
  }

  self.requestId = httpResponse.headers['x-amz-request-id'];
}

util.inherits(Response, aws.Response);

/**
 * Parses the x-amz-expiration header into an object.
 *
 * @param   {String}  expiration
 * @returns {Object}
 */
Response.prototype.parseExpiration = function(expiration) {
  var expiration = self.headers['x-amz-expiration'].match(/"(.+?)"/g);

  if (2 != expiration.length) {
    return;
  }

  return {
    expiry: new Date(expiration[0]),
    ruleId: expiration[1],
  };
}

// Exports
module.exports.version          = version;
module.exports.xmlns            = xmlns;
module.exports.defaultEndpoint  = defaultEndpoint;
module.exports.methods          = methods;
module.exports.methodPath       = __dirname + '/s3/';
module.exports.Request          = Request;
module.exports.Response         = Response;
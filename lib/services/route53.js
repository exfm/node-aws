var
  util = require('util'),
  aws = require('../aws');

// Version Information
var version         = '2010-10-01';
var xmlns           = 'https://route53.amazonaws.com/doc/' + version + '/';
var defaultEndpoint = 'route53.amazonaws.com';
var methods         = [
  'changeResourceRecordSets',
  'createHostedZone',
  'deleteHostedZone',
  'getChange',
  'getHostedZone',
  'listHostedZones',
  'listResourceRecordSets',
];

/**
 * A generic Route53 request.
 */
var Request = function(endpoint) {
  aws.RestRequest.call(this);

  var self  = this;
  self.host = endpoint;
  self.path = '/' + version;
}

util.inherits(Request, aws.RestRequest);

/**
 * Returns the string to sign.
 *
 * @param   {String}  accessKeyId
 * @return  {String}
 */
Request.prototype.getStringToSign = function(accessKeyId) {
  return this.date.toUTCString();
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

  var self  = this;
  var auth  = 'AWS3-HTTPS AWSAccessKeyId=' + accessKeyId
            + ',Algorithm=Hmac' + self.signatureAlgorithm.toUpperCase()
            + ',Signature=' + signature;

  self.headers['X-Amzn-Authorization'] = auth;

  return this;
}

/**
 * A generic Route53 response.
 *
 * @param   {Object}  httpResponse
 */
var Response = function(httpResponse) {
  aws.Response.call(this, httpResponse);

  var self      = this;
  var requestId = httpResponse.headers['x-amzn-requestid'];
  var error     = self.xmlToJson(self.xml.get('/ErrorResponse/Error'));

  if (error) {
    throw new aws.ResponseException(
      error.Message,
      error.Code,
      requestId
    );
  } else {
    console.log(self.xml);
    error = self.xmlToJson(self.xml.get('/AccessDeniedException'));

    if (error) {
      throw new aws.ResponseException(
        error.Message,
        'AccessDeniedException',
        requestId
      );
    }
  }

  self.requestId = requestId;
}

util.inherits(Response, aws.Response);

// Exports
module.exports.version    = version;
module.exports.xmlns      = xmlns;
module.exports.methods    = methods;
module.exports.methodPath = __dirname + '/route53/';
module.exports.Request    = Request;
module.exports.Response   = Response;
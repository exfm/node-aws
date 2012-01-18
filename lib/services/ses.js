var
  util = require('util'),
  aws = require('../aws');

// Version Information
var version         = '2010-12-01';
var xmlns           = 'http://ses.amazonaws.com/doc/' + version + '/';
var defaultEndpoint = 'email.us-east-1.amazonaws.com';
var methods         = [
  'deleteVerifiedEmailAddress',
  'getSendQuota',
  'getSendStatistics',
  'listVerifiedEmailAddresses',
  'sendEmail',
  'verifyEmailAddress',
];

/**
 * A generic SES request.
 *
 * @param   {String}  endpoint
 */
var Request = function(endpoint) {
  aws.QueryRequest.call(this);

  var self              = this;
  self.host             = endpoint || defaultEndpoint;
  self.query['Version'] = version;
}

util.inherits(Request, aws.QueryRequest);

/**
 * Signs the request with the given key and signature.
 *
 * @param   {String}  accessKeyId
 * @param   {String}  signature
 * @return  {Request}
 */
Request.prototype.sign = function(accessKeyId, signature) {
  var self = this;
  var auth = "AWS3-HTTPS AWSAccessKeyId=" + accessKeyId + ", "
           + "Algorithm=Hmac" + self.signatureAlgorithm.toUpperCase() + ", "
           + "Signature=" + signature;

  self.headers['X-Amzn-Authorization'] = auth;

  return self;
}

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
 * A generic SES response.
 *
 * @param   {Object}  httpResponse
 */
var Response = function(httpResponse) {
  aws.Response.call(this, httpResponse);

  var self  = this;
  var error = self.xmlToJson(self.xml.get('/ErrorResponse/Error'));

  if (error) {
    throw new aws.ResponseException(
      error.Message,
      error.Code,
      self.xmlToJson(self.xml.get('/ErrorResponse/RequestId'))
    );
  }

  self.requestId = self.xml.root().get('./ResponseMetadata/RequestId').text();
}

util.inherits(Response, aws.Response);

// Exports
module.exports.version          = version;
module.exports.xmlns            = xmlns;
module.exports.defaultEndpoint  = defaultEndpoint;
module.exports.methods          = methods;
module.exports.methodPath       = __dirname + '/ses/';
module.exports.Request          = Request;
module.exports.Response         = Response;
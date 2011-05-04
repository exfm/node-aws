var
  util = require('util'),
  aws = require('./aws'),
  _ = require('./util');

// Version Information
var version = module.exports.version  = '2010-12-01';
var xmlns   = module.exports.xmlns    = 'http://ses.amazonaws.com/doc/' + version + '/';
var methods = module.exports.methods  = {
  'deleteVerifiedEmailAddress': true,
  'getSendQuota': true,
  'getSendStatistics': true,
  'listVerifiedEmailAddresses': true,
  'sendEmail': true,
  'verifyEmailAddress': true,
}

/**
 * A generic SES request.
 *
 * @param   {Object}  args
 * @param   {String}  action
 */
var Request = module.exports.Request = function(args, action) {
  aws.QueryRequest.call(this, args, 'email.us-east-1.amazonaws.com', '/', version, action);
}

util.inherits(Request, aws.QueryRequest);

/**
 * Returns the string to sign.
 *
 * @param   {String}  accessKeyId
 * @return  {String}
 */
Request.prototype.getStringToSign = function(accessKeyId) {
  return this._date.toUTCString();
}

/**
 * Signs the request with the given key and signature.
 *
 * @param   {String}  accessKeyId
 * @param   {String}  secretAccessKey
 * @return  {Request}
 */
Request.prototype.sign = function(accessKeyId, signature) {
  var self = this;
  var auth = "AWS3-HTTPS "
           + "AWSAccessKeyId=" + accessKeyId + ", "
           + "Algorithm=Hmac" + self.getSignatureAlgorithm().toUpperCase() + ", "
           + "Signature=" + signature;

  self._headers['X-Amzn-Authorization'] = auth;

  return self;
}

/**
 * A generic SES response.
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  aws.Response.call(this, response);

  var self  = this;
  var error = _.xmlToJson(self._xml.get('/ErrorResponse/Error'));

  if (error) {
    throw new aws.ResponseException(
      error.Message,
      error.Code,
      _.xmlToJson(self._xml.get('/ErrorResponse/RequestId'))
    );
  }

  self.requestId = self._xml.root().get('./ResponseMetadata/RequestId').text();
}

util.inherits(Response, aws.Response);
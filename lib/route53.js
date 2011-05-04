var
  util = require('util'),
  crypto = require('crypto'),
  aws = require('./aws'),
  _ = require('./util');

// Version Information
var version = module.exports.version  = '2010-10-01';
var xmlns   = module.exports.xmlns    = 'https://route53.amazonaws.com/doc/' + version + '/';
var methods = module.exports.methods  = {
  'changeResourceRecordSets': true,
  'createHostedZone': true,
  'deleteHostedZone': true,
  'getChange': true,
  'getHostedZone': true,
  'listHostedZones': true,
  'listResourceRecordSets': true,
}

/**
 * A generic Route53 request.
 *
 * @param   {Object}  args
 * @param   {String}  method
 */
var Request = module.exports.Request = function(args, method) {
  aws.RestRequest.call(this, args, 'route53.amazonaws.com', method, '/' + version);
}

util.inherits(Request, aws.RestRequest);

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
  aws.RestRequest.prototype.sign.call(this, accessKeyId, signature);

  this._headers['X-Amzn-Authorization'] = 'AWS3-HTTPS AWSAccessKeyId=' + _.asString(accessKeyId)
                                        + ',Algorithm=Hmac' + this.getSignatureAlgorithm().toUpperCase()
                                        + ',Signature=' + _.asString(signature);

  return this;
}

/**
 * A generic Route53 response.
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  aws.Response.call(this, response);

  var self      = this;
  var requestId = response.headers['x-amzn-requestid'];
  var error     = _.xmlToJson(self._xml.get('/ErrorResponse/Error'));

  if (error) {
    throw new aws.ResponseException(
      error.Message,
      error.Code,
      requestId
    );
  }

  self.requestId = requestId;
}

util.inherits(Response, aws.Response);

/**
 * Checks if the hosted zone ID is valid.
 *
 * @param   {String}  id
 * @return  {Boolean}
 */
var matchHostedZone = module.exports.matchHostedZone = function(id) {
  return _.asString(id).match(/^\/hostedzone\/([^\/]+?)$/);
}

/**
 * Checks if the change ID is valid.
 *
 * @param   {String}  id
 * @return  {Boolean}
 */
var matchChange = module.exports.matchChange = function(id) {
  return _.asString(id).match(/^\/change\/([^\/]+?)$/);
}
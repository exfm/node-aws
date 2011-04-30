var
  util = require('util'),
  aws = require('../aws'),
  _ = require('../util');

// Version Information
var version = '2010-10-01';
var xmlns   = 'https://route53.amazonaws.com/doc/' + version + '/';

/**
 * A generic Route53 request.
 *
 * @param   {Function}  response
 * @param   {String}    action
 */
var Request = function(response, args, method) {
  aws.RestRequest.call(this, response, args, 'route53.amazonaws.com', method, '/' + version);
}

util.inherits(Request, aws.RestRequest);

/**
 * A generic Route53 response.
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = function(headers, data) {
  aws.Response.call(this, headers, data);

  var self      = this;
  var requestId = self._headers['x-amzn-requestid'];
  var error     = _.xmlToJson(self._xml.get('/ErrorResponse/Error'));

  if (error) {
    throw new aws.ResponseError(
      requestId,
      error.Message,
      error.Code
    );
  }

  self.requestId = requestId;
}

util.inherits(Response, aws.Response);

module.exports.version        = version;
module.exports.xmlns          = xmlns;
module.exports.Request        = Request;
module.exports.Response       = Response;
module.exports.createRequest  = function(method, args) {
  var method;

  try {
    method = require('./Route53/' + method);
  } catch (e) {
    throw new Error(method + ' is not a valid Route53 method');
  }

  return new method.Request(args);
}
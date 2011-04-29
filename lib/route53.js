var
  util = require('util'),
  aws = require('./aws'),
  _ = require('./util');

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
  aws.RestResponse.call(this, headers, data);

  var self      = this;
  var xmlError  = self._xml.get('/ErrorResponse/Error')

  if (xmlError) {
    throw new aws.ResponseError(
      _.xmlToJson(xmlError.get('./Message')),
      _.xmlToJson(xmlError.get('./Code'))
    );
  }

  self.requestId = self._headers['x-amzn-requestid'];
}

util.inherits(Response, aws.RestResponse);

module.exports.version  = version;
module.exports.xmlns    = xmlns;
module.exports.Request  = Request;
module.exports.Response = Response;

var getRequest = function(method) {
  return function(args) {
    return new (require('./route53/' + method).Request)(args);
  }
}

var methods = [
  'createHostedZone',
  'getHostedZone',
  'deleteHostedZone',
  'listHostedZones',
  'changeResourceRecordSets',
  'listResourceRecordSets',
  'getChange',
];

for (var i in methods) {
  module.exports[methods[i]] = getRequest(methods[i]);
}
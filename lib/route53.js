var
  util = require('util'),
  aws = require('./aws');

// Version Information
var version = '2010-10-01';
var xmlns   = 'https://route53.amazonaws.com/doc/' + version + '/';

/**
 * A generic Route53 request.
 *
 * @param   {Function}  response
 * @param   {String}    action
 */
var Request = function(response, method) {
  aws.RESTRequest.call(this, response, 'route53.amazonaws.com', method, '/' + version);
}

util.inherits(Request, aws.RESTRequest);

/**
 * A generic Route53 response.
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = function(headers, data) {
  aws.RESTResponse.call(this, headers, data);

  var self      = this;
  var xmlError  = self._xml.get('/ErrorResponse/Error')

  if (xmlError) {
    throw new aws.ResponseError(
      aws.xmlToJSON(xmlError.get('./Message')),
      aws.xmlToJSON(xmlError.get('./Code'))
    );
  }
  
  self._requestID = self._headers['x-amzn-requestid'];
}

util.inherits(Response, aws.RESTResponse);

module.exports.version  = version;
module.exports.xmlns    = xmlns;
module.exports.Request  = Request;
module.exports.Response = Response;
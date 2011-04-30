var
  util = require('util'),
  aws = require('../aws'),
  _ = require('../util');

// Version Information
var version = '2011-02-28';
var xmlns   = 'http://ec2.amazonaws.com/doc/' + version + '/';

/**
 * A generic EC2 request.
 *
 * @param   {Function}  response
 * @param   {String}    action
 */
var Request = function(response, args, action) {
  aws.QueryRequest.call(this, response, args, 'ec2.amazonaws.com', '/', version, action);
}

util.inherits(Request, aws.QueryRequest);

/**
 * A generic EC2 response.
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = function(headers, data) {
  aws.Response.call(this, headers, data);

  var self  = this;
  var error = _.xmlToJson(self._xml.get('/Response/Errors/Error'));

  if (error) {
    console.log(data);
    throw new aws.ResponseError(
      _.xmlToJson(self._xml.get('/Response/RequestID')),
      error.Message,
      error.Code
    );
  }

  self.requestId = self._xml.root().get('./requestId').text();
}

util.inherits(Response, aws.Response);

module.exports.version        = version;
module.exports.xmlns          = xmlns;
module.exports.Request        = Request;
module.exports.Response       = Response;
module.exports.createRequest  = function(method, args) {
  var method;

  try {
    method = require('./EC2/' + method);
  } catch (e) {
    throw new Error(method + ' is not a valid EC2 method');
  }

  return new method.Request(args);
}
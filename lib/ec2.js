var
  util = require('util'),
  aws = require('./aws'),
  _ = require('./util');

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
  aws.QueryResponse.call(this, headers, data);

  var self      = this;
  var xmlError  = self._xml.get('/Response/Errors/Error')

  if (xmlError) {
    throw new aws.ResponseError(
      _.xmlToJson(xmlError.get('./Message')),
      _.xmlToJson(xmlError.get('./Code'))
    );
  }

  self.requestId = self._xml.root().get('./requestId').text();
}

util.inherits(Response, aws.QueryResponse);

module.exports.version  = version;
module.exports.xmlns    = xmlns;
module.exports.Request  = Request;
module.exports.Response = Response;

var getRequest = function(method) {
  return function(args) {
    return new (require('./ec2/' + method).Request)(args);
  }
}

var methods = [
  'describeAddresses',
];

for (var i in methods) {
  module.exports[methods[i]] = getRequest(methods[i]);
}
var
  util = require('util'),
  aws = require('../aws'),
  _ = require('../util');

// Version Information
var version = '2009-04-15';
var xmlns   = 'http://sdb.amazonaws.com/doc/' + version + '/';

/**
 * A generic SimpleDB request.
 *
 * @param   {Function}  response
 * @param   {String}    action
 */
var Request = function(response, args, action) {
  aws.QueryRequest.call(this, response, args, 'sdb.amazonaws.com', '/', version, action);
}

util.inherits(Request, aws.QueryRequest);

/**
 * A generic SimpleDB response.
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

  var metadata    = _.xmlToJson(self._xml.root().get('./ResponseMetadata'));
  self.requestId  = metadata.RequestId;
  self.boxUsage   = parseFloat(metadata.BoxUsage);
}

util.inherits(Response, aws.QueryResponse);

module.exports.version        = version;
module.exports.xmlns          = xmlns;
module.exports.Request        = Request;
module.exports.Response       = Response;
module.exports.createRequest  = function(method, args) {
  var method;

  try {
    method = require('./SimpleDB/' + method);
  } catch (e) {
    throw new Error(method + ' is not a valid SimpleDB method');
  }

  return new method.Request(args);
}
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
 * @param   {Object}  response
 */
var Response = function(response) {
  aws.Response.call(this, response);

  var self  = this;
  var error = _.xmlToJson(self._xml.get('/Response/Errors/Error'));

  if (error) {
    throw new aws.ResponseException(
      error.Message,
      error.Code,
      _.xmlToJson(self._xml.get('/Response/RequestID')),
      {
        boxUsage: _.asFloat(error.BoxUsage),
      }
    );
  }

  var metadata    = _.xmlToJson(self._xml.root().get('./ResponseMetadata'));
  self.requestId  = metadata.RequestId;
  self.boxUsage   = _.asFloat(metadata.BoxUsage);
}

util.inherits(Response, aws.Response);

module.exports.version  = version;
module.exports.xmlns    = xmlns;
module.exports.Request  = Request;
module.exports.Response = Response;
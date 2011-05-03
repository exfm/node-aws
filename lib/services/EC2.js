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
var Response = function(response) {
  aws.Response.call(this, response);

  var self  = this;
  var error = _.xmlToJson(self._xml.get('/Response/Errors/Error'));

  if (error) {
    throw new aws.ResponseException(
      error.Message,
      error.Code,
      _.xmlToJson(self._xml.get('/Response/RequestID'))
    );
  }

  self.requestId = self._xml.root().get('./requestId').text();
}

util.inherits(Response, aws.Response);

module.exports.version  = version;
module.exports.xmlns    = xmlns;
module.exports.Request  = Request;
module.exports.Response = Response;
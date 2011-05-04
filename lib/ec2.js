var
  util = require('util'),
  aws = require('./aws'),
  _ = require('./util');

// Version Information
var version = module.exports.version  = '2011-02-28';
var xmlns   = module.exports.xmlns    = 'http://ec2.amazonaws.com/doc/' + version + '/';
var methods = module.exports.methods  = {
  'describeAddresses': true,
}

/**
 * A generic EC2 request.
 *
 * @param   {Object}  args
 * @param   {String}  action
 */
var Request = module.exports.Request = function(args, action) {
  aws.QueryRequest.call(this, args, 'ec2.amazonaws.com', '/', version, action);
}

util.inherits(Request, aws.QueryRequest);

/**
 * A generic EC2 response.
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
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
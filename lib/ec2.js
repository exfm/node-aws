var
  util = require('util'),
  aws = require('./aws');

/**
 * A generic EC2 request.
 *
 * @param   {Function}  response
 * @param   {String}    action
 */
var Request = function(response, action) {
  aws.QueryRequest.call(this, response, 'ec2.amazonaws.com', '/', '2011-02-28', action);
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
      aws.xmlToJSON(xmlError.get('./Message')),
      aws.xmlToJSON(xmlError.get('./Code'))
    );
  }

  self._requestID = self._xml.root().get('./requestId').text();
}

util.inherits(Response, aws.Response);

module.exports.Request            = Request;
module.exports.Response           = Response;
module.exports.DescribeAddresses  = require('./ec2/DescribeAddresses');
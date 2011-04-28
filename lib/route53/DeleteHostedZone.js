var
  util = require('util'),
  aws = require('../aws'),
  route53 = require('../route53');

/**
 * DeleteHostedZoneRequest
 */
var Request = function(hostedZoneId) {
  route53.Request.call(this, Response, 'DELETE');

  if (!aws.isString(hostedZoneId)) {
    throw new Error('hostedZoneId must be a string');
  }

  var self    = this;
  self._path  += hostedZoneId;
}

util.inherits(Request, route53.Request);

/**
 * DeleteHostedZoneResponse
 */
var Response = function(headers, data) {
  route53.Response.call(this, headers, data);

  var self        = this;
  var changeInfo  = aws.xmlToJSON(self._xml.get('/DeleteHostedZoneResponse/ChangeInfo'));
  self.changeInfo = {
    id: changeInfo.Id,
    status: changeInfo.Status,
    submittedAt: new Date(changeInfo.SubmittedAt),
  };
}

util.inherits(Response, route53.Response);

module.exports.Request  = Request;
module.exports.Response = Response;
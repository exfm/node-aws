var
  util = require('util'),
  ec2 = require('../ec2'),
  ses = require('../ses'),
  _ = require('../util');

/**
 * GET GetSendQuota
 */
var Request = module.exports.Request = function(args) {
  ses.Request.call(this, args, 'GetSendQuota');
}

util.inherits(Request, ses.Request);

/**
 * GetSendQuotaResponse
 */
var Response = module.exports.Response = function(response) {
  ses.Response.call(this, response);

  var self    = this;
  var result  = _.xmlToJson(self._xml.get('/GetSendQuotaResponse/GetSendQuotaResult'));

  self.sentLast24Hours  = _.asFloat(result.SentLast24Hours);
  self.max24HourSend    = _.asFloat(result.Max24HourSend);
  self.maxSendRate      = _.asFloat(result.MaxSendRate);
}

util.inherits(Response, ses.Response);
var
  util = require('util'),
  ec2 = require('../ec2'),
  ses = require('../ses'),
  _ = require('../util');

/**
 * GET GetSendStatistics
 */
var Request = module.exports.Request = function(args) {
  ses.Request.call(this, args, 'GetSendStatistics');
}

util.inherits(Request, ses.Request);

/**
 * GetSendStatisticsResponse
 */
var Response = module.exports.Response = function(response) {
  ses.Response.call(this, response);

  var self        = this;
  var dataPoints  = _.xmlToJson(self._xml.get('/GetSendStatisticsResponse/GetSendStatisticsResult/SendDataPoints/member'));

  self.deliveryAttempts = _.asInteger(dataPoints.DeliveryAttempts);
  self.timestamp        = new Date(dataPoints.Timestamp);
  self.rejects          = _.asInteger(dataPoints.Rejects);
  self.bounces          = _.asInteger(dataPoints.Bounces);
  self.complaints       = _.asInteger(dataPoints.Complaints);
}

util.inherits(Response, ses.Response);
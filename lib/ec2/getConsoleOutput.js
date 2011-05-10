var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET GetConsoleOutput
 */
var Request = module.exports.Request = function(args) {
  ec2.Request.call(this, args, 'GetConsoleOutput');

  var self = this;

  if (null != args.instanceId) {
    self._query['InstanceId'] = _.asString(args.instanceId);
  }
}

util.inherits(Request, ec2.Request);

/**
 * GetConsoleOutputResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self      = this;
  var response  = _.xmlToJson(self._xml.get('/GetConsoleOutputResponse'));

  self.instanceId = response.instanceId;
  self.timestamp  = new Date(response.timestamp);
  self.output     = (new Buffer(response.output, 'base64')).toString();
}

util.inherits(Response, ec2.Response);
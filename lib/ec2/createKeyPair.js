var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET CreateKeyPair
 */
var Request = module.exports.Request = function(args) {
  ec2.Request.call(this, args, 'CreateKeyPair');

  var self = this;

  if (null != args.keyName) {
    self._query['KeyName'] = _.asString(args.keyName);
  }
}

util.inherits(Request, ec2.Request);

/**
 * CreateKeyPairResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self      = this;
  var response  = _.xmlToJson(self._xml.get('/CreateKeyPairResponse'));

  self.keyName        = response.keyName;
  self.keyFingerprint = response.keyFingerprint;
  self.keyMaterial    = response.keyMaterial;
}

util.inherits(Response, ec2.Response);
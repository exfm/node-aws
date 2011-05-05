var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET ImportKeyPair
 */
var Request = module.exports.Request = function(args) {
  ec2.Request.call(this, args, 'ImportKeyPair');

  var self = this;

  if (null != args.keyName) {
    self._query['KeyName'] = _.asString(args.keyName);
  }

  if (null != args.publicKeyMaterial) {
    self._query['PublicKeyMaterial'] = _.asString(args.publicKeyMaterial);
  }
}

util.inherits(Request, ec2.Request);

/**
 * ImportKeyPairResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self      = this;
  var response  = _.xmlToJson(self._xml.get('/ImportKeyPairResponse'));

  self.keyName        = response.keyName;
  self.keyFingerprint = response.keyFingerprint;
}

util.inherits(Response, ec2.Response);
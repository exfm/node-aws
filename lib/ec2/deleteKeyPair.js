var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET DeleteKeyPair
 */
var Request = module.exports.Request = function(args) {
  ec2.Request.call(this, args, 'DeleteKeyPair');

  var self = this;

  if (null != args.keyName) {
    self._query['KeyName'] = _.asString(args.keyName);
  }
}

util.inherits(Request, ec2.Request);

/**
 * DeleteKeyPairResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self      = this;
  var response  = _.xmlToJson(self._xml.get('/DeleteKeyPairResponse'));
  self.return   = _.asBoolean(response.return);
}

util.inherits(Response, ec2.Response);
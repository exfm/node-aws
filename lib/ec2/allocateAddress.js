var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET AllocateAddress
 */
var Request = module.exports.Request = function(args) {
  ec2.Request.call(this, args, 'AllocateAddress');

  var self = this;

  if (null != args.domain) {
    self._query['Domain'] = _.asString(args.domain);
  }
}

util.inherits(Request, ec2.Request);

/**
 * AllocateAddressResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self          = this;
  var response      = _.xmlToJson(self._xml.get('/AllocateAddressResponse'));
  self.publicIp     = response.publicIp;
  self.domain       = response.domain;
  self.allocationId = response.allocationId;

}

util.inherits(Response, ec2.Response);
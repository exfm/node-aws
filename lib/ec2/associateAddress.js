var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET AssociateAddress
 */
var Request = module.exports.Request = function(args) {
  ec2.Request.call(this, args, 'AssociateAddress');

  var self = this;

  if (null != args.publicIp) {
    self._query['PublicIp'] = _.asString(args.publicIp);
  }

  if (null != args.instanceId) {
    self._query['InstanceId'] = _.asString(args.instanceId);
  }

  if (null != args.allocationId) {
    self._query['AllocationId'] = _.asString(args.allocationId);
  }
}

util.inherits(Request, ec2.Request);

/**
 * AssociateAddressResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self            = this;
  var response        = _.xmlToJson(self._xml.get('/AssociateAddressResponse'));
  self.return         = _.asBoolean(response.return);
  self.associationId  = response.associationId;

}

util.inherits(Response, ec2.Response);
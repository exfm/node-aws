var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET DisassociateAddress
 */
var Request = module.exports.Request = function(args) {
  ec2.Request.call(this, args, 'DisassociateAddress');

  var self = this;

  if (null != args.publicIp) {
    self._query['PublicIp'] = _.asString(args.publicIp);
  }

  if (null != args.associationId) {
    self._query['AssociationId'] = _.asString(args.associationId);
  }
}

util.inherits(Request, ec2.Request);

/**
 * DisassociateAddressResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self      = this;
  var response  = _.xmlToJson(self._xml.get('/DisassociateAddressResponse'));
  self.return   = _.asBoolean(response.return);

}

util.inherits(Response, ec2.Response);
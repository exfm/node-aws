var
  util = require('util'),
  ec2 = require('../ec2'),
  ses = require('../ses'),
  _ = require('../util');

/**
 * GET ListVerifiedEmailAddresses
 */
var Request = module.exports.Request = function(args) {
  ses.Request.call(this, args, 'ListVerifiedEmailAddresses');
}

util.inherits(Request, ses.Request);

/**
 * ListVerifiedEmailAddressesResponse
 */
var Response = module.exports.Response = function(response) {
  ses.Response.call(this, response);

  var self                    = this;
  var xmlItems                = self._xml.find('/ListVerifiedEmailAddressesResponse/ListVerifiedEmailAddressesResult/VerifiedEmailAddresses/member');
  self.verifiedEmailAddresses = [];

  for (var i in xmlItems) {
    self.verifiedEmailAddresses.push(_.xmlToJson(xmlItems[i]));
  }
}

util.inherits(Response, ses.Response);
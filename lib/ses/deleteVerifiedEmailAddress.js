var
  util = require('util'),
  ec2 = require('../ec2'),
  ses = require('../ses'),
  _ = require('../util');

/**
 * GET DeleteVerifiedEmailAddress
 */
var Request = module.exports.Request = function(args) {
  ses.Request.call(this, args, 'DeleteVerifiedEmailAddress');

  var self = this;

  if (null != args.emailAddress) {
    self._query['EmailAddress'] = _.asString(args.emailAddress);
  }
}

util.inherits(Request, ses.Request);

/**
 * DeleteVerifiedEmailAddressResponse
 */
var Response = module.exports.Response = ses.Response;
var
  util = require('util'),
  sdb = require('../simpleDb'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET DeleteDomain
 */
var Request = module.exports.Request = function(args) {
  sdb.Request.call(this, args, 'DeleteDomain');

  var self  = this;
  var query = self._query;

  if (null != args.domainName) {
    query['DomainName'] = _.asString(args.domainName);
  }
}

util.inherits(Request, sdb.Request);

/**
 * DeleteDomainResponse
 */
var Response = module.exports.Response = sdb.Response;
var
  util = require('util'),
  sdb = require('../simpleDb'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET CreateDomain
 */
var Request = module.exports.Request = function(args) {
  sdb.Request.call(this, args, 'CreateDomain');

  var self  = this;
  var query = self._query;

  if (null != args.domainName) {
    query['DomainName'] = _.asString(args.domainName);
  }
}

util.inherits(Request, sdb.Request);

/**
 * CreateDomainResponse
 */
var Response = module.exports.Response = sdb.Response;
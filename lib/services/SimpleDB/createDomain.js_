var
  util = require('util'),
  sdb = require('../SimpleDB'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * GET CreateDomain
 */
var Request = function(args) {
  sdb.Request.call(this, Response, args, 'CreateDomain');

  var self  = this;
  var query = self._query;

  if (!_.isString(args.domainName)) {
    throw new Error('args.domainName must be a string');
  }

  query['DomainName'] = args.domainName;
}

util.inherits(Request, sdb.Request);

/**
 * CreateDomainResponse
 */
var Response = sdb.Response;

module.exports.Request  = Request;
module.exports.Response = Response;
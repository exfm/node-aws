var
  util = require('util'),
  sdb = require('../simpleDb'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET ListDomains
 */
var Request = module.exports.Request = function(args) {
  sdb.Request.call(this, args, 'ListDomains');

  var self  = this;
  var query = self._query;

  if (null != args.maxNumberOfDomains) {
    query['MaxNumberOfDomains'] = _.asString(args.maxNumberOfDomains);
  }

  if (null != args.nextToken) {
    query['NextToken'] = _.asString(args.nextToken);
  }
}

util.inherits(Request, sdb.Request);

/**
 * ListDomainsResponse
 */
var Response = module.exports.Response = function(response) {
  sdb.Response.call(this, response);

  var self            = this;
  var xmlResult       = self._xml.get('/ListDomainsResponse/ListDomainsResult');
  var xmlDomainNames  = xmlResult.find('./DomainName');
  self.domainNames    = [];

  for (var i in xmlDomainNames) {
    self.domainNames.push(_.xmlToJson(xmlDomainNames[i]));
  }

  self.nextToken = _.xmlToJson(xmlResult.get('./NextToken'))
}

util.inherits(Response, sdb.Response);
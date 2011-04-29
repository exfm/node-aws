var
  util = require('util'),
  sdb = require('../sdb'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * GET ListDomains
 */
var Request = function(args) {
  sdb.Request.call(this, Response, args, 'ListDomains');

  var self  = this;
  var query = self._query;

  if (null != args.maxNumberOfDomains) {
    if (!_.isInteger(args.maxNumberOfDomains)) {
      throw new Error('args.maxNumberOfDomains must be an integer or null');
    }

    query['MaxNumberOfDomains'] = args.maxNumberOfDomains;
  }

  if (null != args.nextToken) {
    if (!_.isString(args.nextToken)) {
      throw new Error('args.nextToken must be a string or null');
    }

    query['NextToken'] = args.nextToken;
  }
}

util.inherits(Request, sdb.Request);

/**
 * ListDomainsResponse
 */
var Response = function(headers, data) {
  sdb.Response.call(this, headers, data);

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

module.exports.Request  = Request;
module.exports.Response = Response;
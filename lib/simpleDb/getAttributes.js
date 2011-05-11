var
  util = require('util'),
  sdb = require('../simpleDb'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET GetAttributes
 */
var Request = module.exports.Request = function(args) {
  sdb.Request.call(this, args, 'GetAttributes');

  var self  = this;
  var query = self._query;

  if (null != args.domainName) {
    query['DomainName'] = _.asString(args.domainName);
  }

  if (null != args.itemName) {
    query['ItemName'] = _.asString(args.itemName);
  }

  if (null != args.consistentRead) {
    query['ConsistentRead'] = _.asString(args.consistentRead);
  }

  if (_.isArray(args.attributeNames)) {
    for (var i in args.attributeNames) {
      query['AttributeName.' + i] = _.asString(args.attributeNames[i]);
    }
  }
}

util.inherits(Request, sdb.Request);

/**
 * GetAttributesResponse
 */
var Response = module.exports.Response = function(response) {
  sdb.Response.call(this, response);

  var self          = this;
  var xmlAttributes = self._xml.find('/GetAttributesResponse/GetAttributesResult/Attribute');
  self.attributes   = [];

  for (var i in xmlAttributes) {
    var attribute = _.xmlToJson(xmlAttributes[i]);

    self.attributes.push({
      name: attribute.Name,
      value: attribute.Value,
    });
  }
}

util.inherits(Response, sdb.Response);
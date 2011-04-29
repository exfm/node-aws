var
  util = require('util'),
  aws = require('../aws'),
  sdb = require('../sdb'),
  _ = require('../util');

/**
 * GET GetAttributes
 */
var Request = function(args) {
  sdb.Request.call(this, Response, args, 'GetAttributes');

  var self  = this;
  var query = self._query;

  if (!_.isString(args.domainName)) {
    throw new Error('args.domainName must be a string');
  }

  query['DomainName'] = args.domainName;

  if (!_.isString(args.itemName)) {
    throw new Error('args.itemName must be a string');
  }

  query['ItemName'] = args.itemName;

  if (null != args.consistentRead) {
    if (!_.isBoolean(args.consistentRead)) {
      throw new Error('args.consistentRead must be a boolean or null');
    }

    query['ConsistentRead'] = (args.consistentRead) ? 'true' : 'false';
  }

  if (null != args.attributeNames) {
    if (!_.instanceOf(args.attributeNames, Array)) {
      throw new Error('args.attributeNames must be an array');
    }

    for (var i in args.attributeNames) {
      var attributeName = args.attributeNames[i];

      if (!_.isString(attributeName)) {
        throw new Error('args.attributesNames[' + i + '] must be a string');
      }

      query['AttributeName.' + i] = attributeName;
    }
  }
}

util.inherits(Request, sdb.Request);

/**
 * GetAttributesResponse
 */
var Response = function(headers, data) {
  sdb.Response.call(this, headers, data);
console.log(data);
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

module.exports.Request  = Request;
module.exports.Response = Response;
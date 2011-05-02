var
  util = require('util'),
  sdb = require('../SimpleDB'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * GET BatchDeleteAttributes
 */
var Request = function(args) {
  sdb.Request.call(this, Response, args, 'BatchDeleteAttributes');

  var self  = this;
  var query = self._query;

  if (!_.isString(args.domainName)) {
    throw new Error('args.domainName must be a string');
  }

  query['DomainName'] = args.domainName;

  if (!_.instanceOf(args.items, Array)) {
    throw new Error('args.items must be an array');
  }

  for (var i in args.items) {
    var item = args.items[i];

    if (!_.isString(item.itemName)) {
      throw new Error('args.items[' + i + '].itemName must be a string');
    }

    query['Item.' + i + '.ItemName'] = item.itemName;

    if (!_.instanceOf(item.attributes, Array)) {
      throw new Error('args.items[' + i + '].attributes must be an array');
    }

    for (var j in item.attributes) {
      var attribute = item.attributes[j];

      if (!_.isString(attribute.name)) {
        throw new Error('args.items[' + i + '].attributes[' + j + '].name must be a string');
      }

      query['Item.' + i + '.Attribute.' + j + '.Name'] = attribute.name;

      if (!_.isString(attribute.name) && !_.isNumber(attribute.name)) {
        throw new Error('args.items[' + i + '].attributes[' + j + '].value must be a string or number');
      }

      query['Item.' + i + '.Attribute.' + j + '.Value'] = attribute.value;
    }
  }
}

util.inherits(Request, sdb.Request);

/**
 * BatchDeleteAttributesResponse
 */
var Response = sdb.Response;

module.exports.Request  = Request;
module.exports.Response = Response;
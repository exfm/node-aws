var
  util = require('util'),
  sdb = require('../sdb'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * GET PutAttributes
 */
var Request = function(args) {
  sdb.Request.call(this, Response, args, 'PutAttributes');

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

  if (!_.instanceOf(args.attributes, Array)) {
    throw new Error('args.attributes must be an array');
  }

  for (var i in args.attributes) {
    var attribute = args.attributes[i];

    if (!_.isString(attribute.name)) {
      throw new Error('args.attributes[' + i + '].name must be a string');
    }

    query['Attribute.' + i + '.Name'] = attribute.name;

    if (!_.isString(attribute.name) && !_.isNumber(attribute.name)) {
      throw new Error('args.attributes[' + i + '].value must be a string or number');
    }

    query['Attribute.' + i + '.Value'] = attribute.value;

    if (null != attribute.replace) {
      if (!_.isBoolean(attribute.replace)) {
        throw new Error('args.attributes[' + i + '].replace must be a boolean or null');
      }

      query['Attribute.' + i + '.Replace'] = (attribute.replace) ? 'true' : 'false';
    }
  }

  if (null != args.expecteds) {
    if (!_.instanceOf(args.expecteds, Array)) {
      throw new Error('args.expected must be an array or null');
    }

    for (var i in args.expecteds) {
      var expected = args.expecteds[i];

      if (!_.isString(expected.name)) {
        throw new Error('args.expecteds[' + i + '].name must be a string');
      }

      query['Expected.' + i + '.Name'] = expected.name;

      if (null != expected.name) {
        if (!_.isString(expected.name) && !_.isNumber(expected.name)) {
          throw new Error('args.expecteds[' + i + '].value must be a string, number, or null');
        }

        query['Expected.' + i + '.Value'] = expected.value;
      }

      if (null != expected.exists) {
        if (!_.isBoolean(expected.exists)) {
          throw new Error('args.expecteds[' + i + '].exists must be a boolean or null');
        }

        query['Expected.' + i + '.Exists'] = expected.exists;
      }
    }
  }
}

util.inherits(Request, sdb.Request);

/**
 * PutAttributesResponse
 */
var Response = sdb.Response;

module.exports.Request  = Request;
module.exports.Response = Response;
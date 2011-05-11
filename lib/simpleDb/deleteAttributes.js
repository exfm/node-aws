var
  util = require('util'),
  sdb = require('../simpleDb'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET DeleteAttributes
 */
var Request = module.exports.Request = function(args) {
  sdb.Request.call(this, args, 'DeleteAttributes');

  var self  = this;
  var query = self._query;

  if (null != args.domainName) {
    query['DomainName'] = _.asString(args.domainName);
  }

  if (null != args.itemName) {
    query['ItemName'] = _.asString(args.itemName);
  }

  if (_.isArray(args.attributes)) {
    for (var i in args.attributes) {
      var attribute = args.attributes[i];

      if (_.isObject(attribute)) {
        if (null != attribute.name) {
          query['Attribute.' + i + '.Name'] = _.asString(attribute.name);
        }

        if (null != attribute.value) {
          query['Attribute.' + i + '.Value'] = _.asString(attribute.value);
        }
      }
    }
  }

  if (_.isArray(args.expecteds)) {
    for (var i in args.expecteds) {
      var expected = args.expecteds[i];

      if (_.isObject(expected)) {
        if (null != expected.value) {
          query['Expected.' + i + '.Name'] = _.asString(expected.name);
        }

        if (null != expected.value) {
          query['Expected.' + i + '.Value'] = _.asString(expected.value);
        }

        if (null != expected.exists) {
          query['Expected.' + i + '.Exists'] = _.asString(expected.exists);
        }
      }
    }
  }
}

util.inherits(Request, sdb.Request);

/**
 * DeleteAttributesResponse
 */
var Response = module.exports.Response = sdb.Response;
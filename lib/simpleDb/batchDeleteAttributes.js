var
  util = require('util'),
  sdb = require('../simpleDb'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET BatchDeleteAttributes
 */
var Request = module.exports.Request = function(args) {
  sdb.Request.call(this, args, 'BatchDeleteAttributes');

  var self  = this;
  var query = self._query;

  if (null != args.domainName) {
    query['DomainName'] = _.asString(args.domainName);
  }

  if (_.isArray(args.items)) {
    for (var i in args.items) {
      var item = args.items[i];

      if (_.isObject(item)) {
        if (null != item.itemName) {
          query['Item.' + i + '.ItemName'] = _.asString(item.itemName);
        }

        if (_.isArray(item.attributes)) {
          for (var j in item.attributes) {
            var attribute = item.attributes[j];

            if (_.isObject(attribute)) {
              if (null != attribute.name) {
                query['Item.' + i + '.Attribute.' + j + '.Name'] = _.asString(attribute.name);
              }

              if (null != attribute.value) {
                query['Item.' + i + '.Attribute.' + j + '.Value'] = _.asString(attribute.value);
              }
            }
          }
        }
      }
    }
  }
}

util.inherits(Request, sdb.Request);

/**
 * BatchDeleteAttributesResponse
 */
var Response = module.exports.Response = sdb.Response;
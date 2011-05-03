var
  util = require('util'),
  sdb = require('../SimpleDB'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * GET BatchPutAttributes
 */
var Request = function(args) {
  sdb.Request.call(this, Response, args, 'BatchPutAttributes');

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

              if (null != attribute.replace) {
                query['Item.' + i + '.Attribute.' + j + '.Replace'] = _.asString(attribute.replace);
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
 * BatchPutAttributesResponse
 */
var Response = sdb.Response;

module.exports.Request  = Request;
module.exports.Response = Response;
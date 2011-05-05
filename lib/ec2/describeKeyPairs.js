var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET DescribeKeyPairs
 */
var Request = module.exports.Request = function(args) {
  ec2.Request.call(this, args, 'DescribeKeyPairs');

  var self = this;

  if (_.isArray(args.keyNames)) {
    for (var i in args.keyNames) {
      self._query['KeyName.' + i] = _.asString(args.keyNames[i]);
    }
  }

  if (_.isArray(args.filters)) {
    for (var i in args.filters) {
      var filter = args.filters[i];

      if (_.isObject(filter)) {
        if (null != filter.name) {
          self._query['Filter.' + i  +'.Name'] = _.asString(filter.name);
        }

        if (_.isArray(filter.values)) {
          for (var j in filter.values) {
            self._query['Filter.' + i  +'.Value.' + j] = _.asString(filter.values[i]);
          }
        }
      }
    }
  }
}

util.inherits(Request, ec2.Request);

/**
 * DescribeKeyPairsResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self      = this;
  var xmlItems  = self._xml.find('/DescribeKeyPairsResponse/keySet/item');
  self.keyPairs = [];

  for (var i in xmlItems) {
    var xmlItem = _.xmlToJson(xmlItems[i]);

    self.keyPairs.push({
      keyName: xmlItem.keyName,
      keyFingerprint: xmlItem.keyFingerprint,
    });
  }
}

util.inherits(Response, ec2.Response);
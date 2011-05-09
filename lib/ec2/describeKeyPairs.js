var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET DescribeKeyPairs
 */
var Request = module.exports.Request = function(args) {
  ec2.DescribeRequest.call(this, args, 'DescribeKeyPairs');

  var self = this;

  if (_.isArray(args.keyNames)) {
    for (var i in args.keyNames) {
      self._query['KeyName.' + i] = _.asString(args.keyNames[i]);
    }
  }
}

util.inherits(Request, ec2.DescribeRequest);

/**
 * DescribeKeyPairsResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self      = this;
  var xmlItems  = self._xml.find('/DescribeKeyPairsResponse/keySet/item');
  self.keyPairs = [];

  for (var i in xmlItems) {
    var item = _.xmlToJson(xmlItems[i]);

    self.keyPairs.push({
      keyName: item.keyName,
      keyFingerprint: item.keyFingerprint,
    });
  }
}

util.inherits(Response, ec2.Response);
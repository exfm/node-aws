var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET DescribeAddresses
 */
var Request = module.exports.Request = function(args) {
  ec2.DescribeRequest.call(this, args, 'DescribeAddresses');

  var self  = this;
  var query = self._query;

  if (_.isArray(args.publicIps)) {
    for (var i in args.publicIps) {
      query['PublicIp.' + i] = _.asString(args.publicIps[i]);
    }
  }

  if (_.isArray(args.allocationIds)) {
    for (var i in args.allocationIds) {
      query['AllocationId.' + i] = _.asString(args.publicIps[i]);
    }
  }
}

util.inherits(Request, ec2.DescribeRequest);

/**
 * DescribeAddressesResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self        = this;
  var xmlItems    = self._xml.find('/DescribeAddressesResponse/addressesSet/item');
  self.addresses  = [];

  for (var i in xmlItems) {
    var item = _.xmlToJson(xmlItems[i]);

    self.addresses.push({
      publicIp: item.publicIp,
      allocationId: item.allocationId,
      domain: item.domain,
      instanceId: item.instanceId,
      associationId: item.associationId,
    });
  }
}

util.inherits(Response, ec2.Response);
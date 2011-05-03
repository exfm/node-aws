var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET DescribeAddresses
 */
var Request = function(args) {
  ec2.Request.call(this, Response, args, 'DescribeAddresses');

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

  if (_.isArray(args.allocationIds)) {
    for (var i in args.filters) {
      var filter = args.filters[i];

      if (_.isObject(filter)) {
        if (null != filter.name) {
          query['Filter.' + i  +'.Name'] = _.asString(filter.name);
        }

        if (_.isArray(filter.values)) {
          for (var j in filter.values) {
            query['Filter.' + i  +'.Value.' + j] = _.asString(filter.values[i]);
          }
        }
      }
    }
  }
}

util.inherits(Request, ec2.Request);

/**
 * DescribeAddressesResponse
 */
var Response = function(response) {
  ec2.Response.call(this, response);
  var self        = this;
  var xmlItems    = self._xml.find('/DescribeAddressesResponse/addressesSet/item');
  self.addresses  = [];

  for (var i in xmlItems) {
    var xmlItem = _.xmlToJson(xmlItems[i]);

    self.addresses.push({
      publicIp: xmlItem.publicIp,
      allocationId: xmlItem.allocationId,
      domain: xmlItem.domain,
      instanceId: xmlItem.instanceId,
      associationId: xmlItem.associationId,
    });
  }
}

util.inherits(Response, ec2.Response);

module.exports.Request  = Request;
module.exports.Response = Response;
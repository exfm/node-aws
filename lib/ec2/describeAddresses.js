var
  util = require('util'),
  aws = require('../aws'),
  ec2 = require('../ec2'),
  _ = require('../util');

/**
 * GET DescribeAddresses
 */
var Request = function(args) {
  ec2.Request.call(this, Response, args, 'DescribeAddresses');

  var self  = this;
  var query = self._query;

  if (null != args.publicIps) {
    if (!args.publicIps instanceof Array) {
      throw new Error('args.publicIps must be an Array');
    }

    for (var i in args.publicIps) {
      if (!awsutil.isString(args.publicIps[i])) {
        throw new Error('args.publicIps[' + i + '] must be a string');
      }

      query['PublicIp.' + i] = args.publicIps[i];
    }
  }

  if (null != args.allocationIds) {
    if (!args.allocationIds instanceof Array) {
      throw new Error('args.allocationIds must be an Array');
    }

    for (var i in args.allocationIds) {
      if (!awsutil.isString(args.allocationIds[i])) {
        throw new Error('args.allocationIds[' + i + '] must be a string');
      }

      query['AllocationId.' + i] = args.publicIps[i];
    }
  }

  if (null != args.filters) {
    if (!args.filters instanceof Array) {
      throw new Error('args.filters must be an Array');
    }

    for (var i in args.filters) {
      var filter = args.filters[i];

      if (null == filter || !filter instanceof Object) {
        throw new Error('args.filters[' + i + '] must be an object');
      }

      if (!awsutil.isString(filter.name)) {
        throw new Error('args.filters[' + i + '].name is a required string');
      }

      query['Filter.' + i  +'.Name'] = filter.name;

      if (null == filter.values || !filter.values instanceof Array) {
        throw new Error('args.filters[' + i + '].values is a required Array');
      }

      for (var j in filter.values) {
        var value = filter.values[i];

        if (!awsutil.isString(value)) {
          throw new Error('args.filters[' + i + '].values[' + j + '] must be a string');
        }

        query['Filter.' + i  +'.Value.' + j] = value;
      }
    }
  }
}

util.inherits(Request, ec2.Request);

/**
 * DescribeAddressesResponse
 */
var Response = function(headers, data) {
  ec2.Response.call(this, headers, data);
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
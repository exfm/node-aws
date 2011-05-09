var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET DescribeRegions
 */
var Request = module.exports.Request = function(args) {
  ec2.DescribeRequest.call(this, args, 'DescribeRegions');

  var self = this;

  if (_.isArray(args.regionNames)) {
    for (var i in args.regionNames) {
      self._query['RegionName.' + i] = args.regionNames[i];
    }
  }
}

util.inherits(Request, ec2.DescribeRequest);

/**
 * DescribeRegionsResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self      = this;
  var xmlItems  = self._xml.find('/DescribeRegionsResponse/regionInfo/item');
  self.regions  = [];

  for (var i in xmlItems) {
    var item = _.xmlToJson(xmlItems[i]);

    self.regions.push({
      regionName: item.regionName,
      regionEndpoint: item.regionEndpoint,
    });
  }
}

util.inherits(Response, ec2.Response);
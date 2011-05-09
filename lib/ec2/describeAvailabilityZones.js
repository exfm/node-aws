var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET DescribeAvailabilityZones
 */
var Request = module.exports.Request = function(args) {
  ec2.DescribeRequest.call(this, args, 'DescribeAvailabilityZones');

  var self = this;

  if (_.isArray(args.zoneNames)) {
    for (var i in args.zoneNames) {
      self._query['ZoneName.' + i] = args.zoneNames[i];
    }
  }
}

util.inherits(Request, ec2.DescribeRequest);

/**
 * DescribeAvailabilityZonesResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self                = this;
  var xmlItems            = self._xml.find('/DescribeAvailabilityZonesResponse/availabilityZoneInfo/item');
  self.availabilityZones  = [];

  for (var i in xmlItems) {
    var xmlItem     = xmlItems[i];
    var xmlMessages = xmlItem.find('./messageSet/item/message');
    var item        = _.xmlToJson(xmlItems[i]);
    var messages    = [];

    for (var j in xmlMessages) {
      messages.push(_.xmlToJson(xmlMessages[j]));
    }

    self.availabilityZones.push({
      zoneName: item.zoneName,
      zoneState: item.zoneState,
      regionName: item.regionName,
      messages: messages,
    });
  }
}

util.inherits(Response, ec2.Response);
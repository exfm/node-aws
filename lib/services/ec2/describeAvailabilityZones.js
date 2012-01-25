/**
 * GET DescribeAvailabilityZones
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DescribeAvailabilityZones';

  if (Array.isArray(args.zoneNames)) {
    for (var i in args.zoneNames) {
      request.query['ZoneName.' + i] = args.zoneNames[i];
    }
  }

  request.encodeFilters(args);
}

/**
 * DescribeAvailabilityZonesResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  response.data.availabilityZones = [];

  response.xml.find('/DescribeAvailabilityZonesResponse/availabilityZoneInfo/item').forEach(function(xmlItem) {
    var item      = response.xmlToJson(xmlItem);
    var messages  = [];

    xmlItem.find('./messageSet/item/message').forEach(function(xmlMessage) {
      messages.push(response.xmlToJson(xmlMessage));
    });

    response.data.availabilityZones.push({
      zoneName: item.zoneName,
      zoneState: item.zoneState,
      regionName: item.regionName,
      messages: messages,
    });
  });
}
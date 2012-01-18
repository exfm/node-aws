var util = require('util');

/**
 * GET DescribeAddresses
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DescribeAddresses';

  if (util.isArray(args.publicIps)) {
    for (var i in args.publicIps) {
      request.query['PublicIp.' + i] = args.publicIps[i];
    }
  }

  if (util.isArray(args.allocationIds)) {
    for (var i in args.allocationIds) {
      request.query['AllocationId.' + i] = args.publicIps[i];
    }
  }

  request.encodeFilters(args);
}

/**
 * DescribeAddressesResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  response.data.addresses = [];

  response.xml.find('/DescribeAddressesResponse/addressesSet/item').forEach(function(xmlItem) {
    response.data.addresses.push(response.xmlToJson(xmlItem));
  });
}
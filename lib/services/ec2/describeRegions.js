/**
 * GET DescribeRegions
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DescribeRegions';

  if (Array.isArray(args.regionNames)) {
    for (var i in args.regionNames) {
      request.query['RegionName.' + i] = args.regionNames[i];
    }
  }

  request.encodeFilters(args);
};

/**
 * DescribeRegionsResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  response.data.regions = [];

  response.xml.find('/DescribeRegionsResponse/regionInfo/item').forEach(function(xmlItem) {
    response.data.regions.push(response.xmlToJson(xmlItem));
  });
};
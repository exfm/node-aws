/**
 * GET DescribeKeyPairs
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  
  request.query['Action'] = 'CreateTags';

  if (Array.isArray(args.resourceIds)) {
    for (var i in args.resourceIds) {
      request.query['ResourceId.' + i] = args.resourceIds[i];
    }
  }

  
  if (Array.isArray(args.tags)) {
    for (var i in args.tags) {
      request.query['Tag.' + i + '.Key'] = args.tags[i].key
      request.query['Tag.' + i + '.Value'] = args.tags[i].value
    }
  }

  request.encodeFilters(args);
}

/**
 * DescribeKeyPairsResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  response.data.keyPairs = [];

  response.data['return'] = 'true' === response.xmlToJson(response.xml.get('/CreateTagsResponse/return'));
 
}
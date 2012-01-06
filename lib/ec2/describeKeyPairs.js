var util = require('util');

/**
 * GET DescribeKeyPairs
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DescribeKeyPairs';

  if (util.isArray(args.keyNames)) {
    for (var i in args.keyNames) {
      request.query['KeyName.' + i] = args.keyNames[i];
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

  response.xml.find('/DescribeKeyPairsResponse/keySet/item').forEach(function(xmlItem) {
    response.data.keyPairs.push(response.xmlToJson(xmlItem));
  });
}
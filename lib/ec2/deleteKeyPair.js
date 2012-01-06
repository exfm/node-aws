/**
 * GET DeleteKeyPair
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DeleteKeyPair';

  if ('undefined' !== typeof args.keyName) {
    request.query['KeyName'] = args.keyName;
  }
}

/**
 * DeleteKeyPairResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  response.data.return = 'true' === response.xmlToJson(response.xml.get('/DeleteKeyPairResponse/return'));
}
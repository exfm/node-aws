/**
 * GET CreateKeyPair
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'CreateKeyPair';

  if ('undefined' !== typeof args.keyName) {
    request.query['KeyName'] = args.keyName;
  }
}

/**
 * CreateKeyPairResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  var keyPair = response.xmlToJson(response.xml.get('/CreateKeyPairResponse'));

  response.data.keyName         = keyPair.keyName;
  response.data.keyFingerprint  = keyPair.keyFingerprint;
  response.data.keyMaterial     = keyPair.keyMaterial;
}
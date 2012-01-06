/**
 * GET ImportKeyPair
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'ImportKeyPair';

  if ('undefined' !== typeof args.keyName) {
    request.query['KeyName'] = args.keyName;
  }

  if ('undefined' !== typeof args.publicKeyMaterial) {
    request.query['PublicKeyMaterial'] = args.publicKeyMaterial;
  }
}

/**
 * ImportKeyPairResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  var keyPair = response.xmlToJson(response.xml.get('/ImportKeyPairResponse'));

  response.data.keyName         = keyPair.keyName;
  response.data.keyFingerprint  = keyPair.keyFingerprint;
}
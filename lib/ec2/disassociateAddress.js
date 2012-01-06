/**
 * GET DisassociateAddress
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DisassociateAddress';

  if ('undefined' !== typeof args.publicIp) {
    request.query['PublicIp'] = args.publicIp;
  }

  if ('undefined' !== typeof args.associationId) {
    request.query['AssociationId'] = args.associationId;
  }
}

/**
 * DisassociateAddressResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  response.data.return = 'true' === response.xmlToJson(response.xml.get('/DisassociateAddressResponse/return'));
}
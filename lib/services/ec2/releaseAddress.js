/**
 * GET ReleaseAddress
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'ReleaseAddress';

  if ('undefined' !== typeof args.publicIp) {
    request.query['PublicIp'] = args.publicIp;
  }

  if ('undefined' !== typeof args.allocationId) {
    request.query['AllocationId'] = args.allocationId;
  }
}

/**
 * ReleaseAddressResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  response.data.return = 'true' === response.xmlToJson(response.xml.get('/ReleaseAddressResponse/return'));
}
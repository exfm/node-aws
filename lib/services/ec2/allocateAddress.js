/**
 * GET AllocateAddress
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'AllocateAddress';

  if ('undefined' !== typeof args.domain) {
    request.query['Domain'] = args.domain;
  }
}

/**
 * AllocateAddressResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  var address             = response.xmlToJson(response.xml.get('/AllocateAddressResponse'));
  response.data.publicIp  = address.publicIp;
  response.data.domain    = address.domain;

  if ('undefined' !== typeof address.allocationId) {
    response.data.allocationId = address.allocationId;
  }
}
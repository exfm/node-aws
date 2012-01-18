/**
 * GET AssociateAddress
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'AssociateAddress';

  if ('undefined' !== typeof args.publicIp) {
    request.query['PublicIp'] = args.publicIp;
  }

  if ('undefined' !== typeof args.instanceId) {
    request.query['InstanceId'] = args.instanceId;
  }

  if ('undefined' !== typeof args.allocationId) {
    request.query['AllocationId'] = args.allocationId;
  }

  if ('undefined' !== typeof args.networkInterfaceId) {
    request.query['NetworkInterfaceId'] = args.networkInterfaceId;
  }
}

/**
 * AssociateAddressResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  var result            = response.xmlToJson(response.xml.get('/AssociateAddressResponse'));
  response.data.return  = 'true' === result.return;

  if ('undefined' !== typeof result.associationId) {
    response.data.associationId = result.associationId;
  }
}
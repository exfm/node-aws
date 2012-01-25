/**
 * GET RebootInstances
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'RebootInstances';

  if (Array.isArray(args.instanceIds)) {
    for (var i in args.instanceIds) {
      request.query['InstanceId.' + i] = args.instanceIds[i];
    }
  }
}

/**
 * RebootInstancesResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  response.data.return = 'true' === response.xmlToJson(response.xml.get('/RebootInstancesResponse/return'));
}
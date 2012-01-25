/**
 * GET StartInstances
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'StartInstances';

  if (Array.isArray(args.instanceIds)) {
    for (var i in args.instanceIds) {
      request.query['InstanceId.' + i] = args.instanceIds[i];
    }
  }
}

/**
 * StartInstancesResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  response.data.instances = [];

  response.xml.find('/StartInstancesResponse/instancesSet/item').forEach(function(xmlInstance) {
    var instance                = response.xmlToJson(xmlInstance);
    instance.currentState.code  = parseInt(instance.currentState.code);
    instance.previousState.code = parseInt(instance.previousState.code);

    response.data.instances.push(instance);
  });
}
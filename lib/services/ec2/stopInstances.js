var util = require('util');

/**
 * GET StopInstances
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'StopInstances';

  if (util.isArray(args.instanceIds)) {
    for (var i in args.instanceIds) {
      request.query['InstanceId.' + i] = args.instanceIds[i];
    }
  }

  if ('undefined' !== typeof args.force) {
    request.query['Force'] = (args.force) ? 'true' : 'false';
  }
}

/**
 * StopInstancesResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  response.data.instances = [];

  response.xml.find('/StopInstancesResponse/instancesSet/item').forEach(function(xmlInstance) {
    var instance                = response.xmlToJson(xmlInstance);
    instance.currentState.code  = parseInt(instance.currentState.code);
    instance.previousState.code = parseInt(instance.previousState.code);

    response.data.instances.push(instance);
  });
}
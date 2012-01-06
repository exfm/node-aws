/**
 * GET GetConsoleOutput
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'GetConsoleOutput';

  if ('undefined' !== typeof args.instanceId) {
    request.query['InstanceId'] = args.instanceId;
  }
}

/**
 * GetConsoleOutputResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  var result                = response.xmlToJson(response.xml.get('/GetConsoleOutputResponse'));
  response.data.instanceId  = result.instanceId;
  response.data.timestamp   = new Date(result.timestamp);
  response.data.output      = (new Buffer(result.output, 'base64')).toString();
}
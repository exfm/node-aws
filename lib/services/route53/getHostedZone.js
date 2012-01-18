/**
 * GET GetHostedZone
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method  = 'GET';
  request.path   += args.id;
}

/**
 * GetHostedZoneResponse
 *
 * @param   {Object}  response
 */
module.exports.decodeResponse = function(response) {
  var xml             = response.xml.get('/GetHostedZoneResponse');
  var hostedZone      = response.xmlToJson(xml.get('./HostedZone'));
  var xmlNameServers  = xml.find('./DelegationSet/NameServers/NameServer');

  response.data.hostedZone = {
    id: hostedZone.Id,
    name: hostedZone.Name,
    callerReference: hostedZone.CallerReference,
  };

  if (null != hostedZone.Config && hostedZone.Config instanceof Object) {
    response.data.hostedZone.config.comment = hostedZone.Config.Comment;
  }

  response.data.delegationSet = {
    nameServers: [],
  };

  xmlNameServers.forEach(function(xmlNameServer) {
    response.data.delegationSet.nameServers.push(response.xmlToJson(xmlNameServer));
  });
}
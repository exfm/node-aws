var route53 = require('../route53');

/**
 * POST CreatedHostedZone
 *
 * @param   {Request}  request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method  = 'POST';
  request.path   += '/hostedzone';
  var xml         = request.xml('CreateHostedZoneRequest', route53.xmlns).root();

  if ('undefined' !== typeof args.name) {
    xml.node('Name').text(args.name);
  }

  if ('undefined' !== typeof args.callerReference) {
    xml.node('CallerReference').text(args.callerReference);
  }

  if ('undefined' !== typeof args.config) {
    if ('undefined' !== typeof args.config.comment) {
      xml.node('HostedZoneConfig').node('Comment').text(args.config.comment);
    }
  }
}

/**
 * CreatedHostedZoneResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var xml         = response.xml.get('/CreateHostedZoneResponse');
  var hostedZone  = response.xmlToJson(xml.get('./HostedZone'));
  var changeInfo  = response.xmlToJson(xml.get('./ChangeInfo'));

  response.data.hostedZone = {
    id: hostedZone.Id,
    name: hostedZone.Name,
    callerReference: hostedZone.CallerReference,
  };

  if (null != hostedZone.Config && hostedZone.Config instanceof Object) {
    response.data.hostedZone.config.comment = hostedZone.Config.Comment;
  }

  response.data.changeInfo = {
    id: changeInfo.Id,
    status: changeInfo.Status,
    submittedAt: new Date(changeInfo.SubmittedAt),
  };

  response.data.delegationSet = {
    nameServers: [],
  };

  xml.find('./DelegationSet/NameServers/NameServer').forEach(function(xmlNameServer) {
    response.data.delegationSet.nameServers.push(response.xmlToJson(xmlNameServer));
  });
}
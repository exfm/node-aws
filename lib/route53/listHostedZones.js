/**
 * GET ListHostedZones
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method = 'GET';

  var query = {};

  if (args instanceof Object) {
    if ('undefined' !== typeof args.marker) {
      query.marker = args.marker;
    }

    if ('undefined' !== typeof args.maxItems) {
      query.maxitems = args.maxItems;
    }
  }

  request.path += '/hostedzone?' + request.stringifyQuery(query);
}

/**
 * ListHostedZonesResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var xml                   = response.xml.get('/ListHostedZonesResponse');
  response.data.hostedZones = [];
  response.data.maxItems    = parseInt(response.xmlToJson(xml.get('./MaxItems')));
  response.data.isTruncated = 'true' == response.xmlToJson(xml.get('./IsTruncated'));
  response.data.nextMarker  = response.xmlToJson(xml.get('./NextMarker'));

  xml.find('./HostedZones/HostedZone').forEach(function(xmlHostedZone) {
    xmlHostedZone = response.xmlToJson(xmlHostedZone);

    var hostedZone = {
      id: xmlHostedZone.Id,
      name: xmlHostedZone.Name,
      callerReference: xmlHostedZone.CallerReference,
    };

    if (null != xmlHostedZone.Config && xmlHostedZone.Config instanceof Object) {
      hostedZone.config.comment = xmlHostedZone.Config.Comment;
    }

    response.data.hostedZones.push(hostedZone);
  });
}
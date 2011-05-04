var
  util = require('util'),
  route53 = require('../route53'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET ListHostedZones
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  route53.Request.call(this, args, 'GET');

  var query = {};

  if (null != args.marker) {
    query.marker = _.asString(args.marker);
  }

  if (null != args.maxItems) {
    query.maxitems = _.asString(args.maxItems);
  }

  this._path += '/hostedzone?' + _.stringifyQuery(query);
}

util.inherits(Request, route53.Request);

/**
 * ListHostedZonesResponse
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = module.exports.Response = function(response) {
  route53.Response.call(this, response);

  var self            = this;
  var xmlRoot         = self._xml.get('/ListHostedZonesResponse');
  var xmlHostedZones  = xmlRoot.find('./HostedZones/HostedZone');
  self.hostedZones    = [];
  self.maxItems       = _.asInteger(_.xmlToJson(xmlRoot.get('./MaxItems')));
  self.isTruncated    = 'true' == _.xmlToJson(xmlRoot.get('./IsTruncated'));
  self.nextMarker     = _.xmlToJson(xmlRoot.get('./NextMarker'));

  for (var i in xmlHostedZones) {
    var xmlHostedZone = _.xmlToJson(xmlHostedZones[i]);

    var hostedZone = {
      id: xmlHostedZone.Id,
      name: xmlHostedZone.Name,
      callerReference: xmlHostedZone.CallerReference,
    };

    if (null != xmlHostedZone.Config && xmlHostedZone.Config instanceof Object) {
      hostedZone.config.comment = xmlHostedZone.Config.Comment;
    }

    self.hostedZones.push(hostedZone);
  }
}

util.inherits(Response, route53.Response);
var
  util = require('util'),
  aws = require('../aws'),
  route53 = require('../route53'),
  _ = require('../util');

/**
 * GET ListHostedZones
 *
 * @param   {Object}  args
 */
var Request = function(args) {
  route53.Request.call(this, Response, args, 'GET');

  var query = {};

  if (null != args.marker) {
    if (!_.isString(args.marker)) {
      throw new Error('args.marker must be a string');
    } else {
      query.marker = args.marker;
    }
  }

  if (null != args.maxItems) {
    if (!_.isInteger(args.maxItems)) {
      throw new Error('args.maxItems must be a number');
    } else {
      query.maxitems = args.maxItems = parseInt(args.maxItems);
    }
  }

  this._path += '/hostedzone?' + _.stringifyQuery(args);
}

util.inherits(Request, route53.Request);

/**
 * ListHostedZonesResponse
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = function(headers, data) {
  route53.Response.call(this, headers, data);

  var self            = this;
  var xmlRoot         = self._xml.get('/ListHostedZonesResponse');
  var xmlHostedZones  = xmlRoot.find('./HostedZones/HostedZone');
  self.hostedZones    = [];
  self.maxItems       = _.xmlToJson(xmlRoot.get('./MaxItems'));
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

module.exports.Request  = Request;
module.exports.Response = Response;
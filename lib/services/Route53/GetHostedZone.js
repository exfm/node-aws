var
  util = require('util'),
  route53 = require('../Route53'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * GET GetHostedZone
 *
 * @param   {Object}  args
 */
var Request = function(args) {
  route53.Request.call(this, Response, args, 'GET');

  if (!_.isString(args.id)) {
    throw new Error('args.id is a required string');
  }

  if (!args.id.match(/^\/hostedzone\/[A-Z0-9]+$/)) {
    throw new Error('args.id is not a valid id');
  }

  this._path += args.id;
}

util.inherits(Request, route53.Request);

/**
 * GetHostedZoneResponse
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = function(headers, data) {
  route53.Response.call(this, headers, data);

  var self            = this;
  var xmlRoot         = self._xml.get('/GetHostedZoneResponse');
  var hostedZone      = _.xmlToJson(xmlRoot.get('./HostedZone'));
  var xmlNameServers  = xmlRoot.find('./DelegationSet/NameServers/NameServer');

  self.hostedZone = {
    id: hostedZone.Id,
    name: hostedZone.Name,
    callerReference: hostedZone.CallerReference,
  };

  if (null != hostedZone.Config && !hostedZone.Config instanceof Object) {
    self.hostedZone.config.comment = hostedZone.Config.Comment;
  }

  self.nameServers = [];

  for (var i in xmlNameServers) {
    self.nameServers.push(_.xmlToJson(xmlNameServers[i]));
  }
}

util.inherits(Response, route53.Response);

module.exports.Request  = Request;
module.exports.Response = Response;
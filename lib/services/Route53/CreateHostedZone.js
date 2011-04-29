var
  util = require('util'),
  libxmljs = require('libxmljs'),
  route53 = require('../Route53'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * POST CreatedHostedZone
 *
 * @param   {Object}  args
 */
var Request = function(args) {
  route53.Request.call(this, Response, args, 'POST');

  var self    = this;
  self._path += '/hostedzone';
  self._xml   = new libxmljs.Document();
  var xmlRoot = self._xml.node('CreateHostedZoneRequest');

  xmlRoot.namespace(route53.xmlns);

  if (!_.isString(args.name)) {
    throw new Error('args.name is a required string');
  }

  xmlRoot.node('Name').text(args.name);

  if (!_.isString(args.callerReference)) {
    throw new Error('args.callerReference is a required string');
  }

  xmlRoot.node('CallerReference').text(args.callerReference);

  if (null != args.config) {
    if (!_.instanceOf(args.config, Object)) {
      throw new Error('args.config must be an object');
    } else if (!_.isString(args.config.comment)) {
      throw new Error('args.config.comment must be a string');
    }

    xmlRoot.node('HostedZoneConfig').node('Comment').text(args.config.comment);
  }
}

util.inherits(Request, route53.Request);

/**
 * CreatedHostedZoneResponse
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = function(headers, data) {
  route53.Response.call(this, headers, data);

  var self            = this;
  var xmlRoot         = self._xml.get('/CreateHostedZoneResponse');
  var hostedZone      = _.xmlToJson(xmlRoot.get('./HostedZone'));
  var changeInfo      = _.xmlToJson(xmlRoot.get('./ChangeInfo'));
  var xmlNameServers  = xmlRoot.find('./DelegationSet/NameServers/NameServer');

  self.hostedZone = {
    id: hostedZone.Id,
    name: hostedZone.Name,
    callerReference: hostedZone.CallerReference,
  };

  if (null != hostedZone.Config && !hostedZone.Config instanceof Object) {
    self.hostedZone.config.comment = hostedZone.Config.Comment;
  }

  self.changeInfo = {
    id: changeInfo.Id,
    status: changeInfo.Status,
    submittedAt: new Date(changeInfo.SubmittedAt),
  };

  self.nameServers = [];

  for (var i in xmlNameServers) {
    self.nameServers.push(_.xmlToJson(xmlNameServers[i]));
  }
}

util.inherits(Response, route53.Response);

module.exports.Request  = Request;
module.exports.Response = Response;
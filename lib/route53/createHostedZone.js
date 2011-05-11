var
  util = require('util'),
  libxmljs = require('libxmljs'),
  route53 = require('../route53'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * POST CreatedHostedZone
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  route53.Request.call(this, args, 'POST');

  var self    = this;
  self._path += '/hostedzone';
  self._xml   = new libxmljs.Document();
  var xmlRoot = self._xml.node('CreateHostedZoneRequest');

  xmlRoot.namespace(route53.xmlns);

  if (null != args.name) {
    xmlRoot.node('Name').text(_.asString(args.name));
  }

  if (null != args.callerReference) {
    xmlRoot.node('CallerReference').text(_.asString(args.callerReference));
  }

  if (_.isObject(args.config)) {
    if (null != args.config.comment) {
      xmlRoot.node('HostedZoneConfig').node('Comment').text(_.asString(args.config.comment));
    }
  }
}

util.inherits(Request, route53.Request);

/**
 * CreatedHostedZoneResponse
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  route53.Response.call(this, response);

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

  self.delegationSet.nameServers = [];

  for (var i in xmlNameServers) {
    self.delegationSet.nameServers.push(_.xmlToJson(xmlNameServers[i]));
  }
}

util.inherits(Response, route53.Response);
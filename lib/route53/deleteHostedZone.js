var
  util = require('util'),
  route53 = require('../route53'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * DELETE DeleteHostedZone
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  route53.Request.call(this, args, 'DELETE');

  if (!route53.matchHostedZone(args.id)) {
    throw new aws.Exception(null, '"' + args.id + '" is not a valid id', 'InvalidArgument');
  }

  var self    = this;
  self._path += _.asString(args.id);
}

util.inherits(Request, route53.Request);

/**
 * DeleteHostedZoneResponse
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  route53.Response.call(this, response);

  var self        = this;
  var changeInfo  = _.xmlToJson(self._xml.get('/DeleteHostedZoneResponse/ChangeInfo'));
  self.changeInfo = {
    id: changeInfo.Id,
    status: changeInfo.Status,
    submittedAt: new Date(changeInfo.SubmittedAt),
  };
}

util.inherits(Response, route53.Response);
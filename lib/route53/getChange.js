var
  util = require('util'),
  route53 = require('../route53'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET GetChange
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  route53.Request.call(this, args, 'GET');

  if (!route53.matchChange(args.id)) {
    throw new aws.Exception('"' + args.id + '" is not a valid id', 'InvalidArgument');
  }

  this._path += _.asString(args.id);
}

util.inherits(Request, route53.Request);

/**
 * GetChangeResponse
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  route53.Response.call(this, response);

  var self        = this;
  var xmlRoot     = self._xml.get('/GetChangeResponse');
  var changeInfo  = _.xmlToJson(xmlRoot.get('./ChangeInfo'));

  self.changeInfo = {
    id: changeInfo.Id.match(/[^\/]+$/).toString(),
    status: changeInfo.Status,
    submittedAt: new Date(changeInfo.SubmittedAt),
  };
}

util.inherits(Response, route53.Response);
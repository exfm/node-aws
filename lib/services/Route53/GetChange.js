var
  util = require('util'),
  route53 = require('../Route53'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * GET GetChange
 *
 * @param   {Object}  args
 */
var Request = function(args) {
  route53.Request.call(this, Response, args, 'GET');

  if (!_.isString(args.id)) {
    throw new Error('args.id is a required string');
  }

  if (!args.id.match(/^\/change\/[A-Z0-9]+$/)) {
    throw new Error('args.id is not a valid id');
  }

  this._path += args.id;
}

util.inherits(Request, route53.Request);

/**
 * GetChangeResponse
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = function(headers, data) {
  route53.Response.call(this, headers, data);

  var self        = this;
  var xmlRoot     = self._xml.get('/GetChangeResponse');
  var changeInfo  = _.xmlToJson(xmlRoot.get('./ChangeInfo'));

  self.changeInfo = {
    id: changeInfo.Id,
    status: changeInfo.Status,
    submittedAt: new Date(changeInfo.SubmittedAt),
  };
}

util.inherits(Response, route53.Response);

module.exports.Request  = Request;
module.exports.Response = Response;
var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET RebootInstances
 */
var Request = module.exports.Request = function(args) {
  ec2.Request.call(this, args, 'RebootInstances');

  var self = this;

  if (_.isArray(args.instanceIds)) {
    for (var i in args.instanceIds) {
      self._query['InstanceId.' + i] = _.asString(args.instanceIds[i]);
    }
  }
}

util.inherits(Request, ec2.Request);

/**
 * RebootInstancesResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self    = this;
  self.return = _.asBoolean(_.xmlToJson(self._xml.get('/RebootInstancesResponse/return')));
}

util.inherits(Response, ec2.Response);
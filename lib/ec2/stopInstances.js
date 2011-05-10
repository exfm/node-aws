var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET StopInstances
 */
var Request = module.exports.Request = function(args) {
  ec2.Request.call(this, args, 'StopInstances');

  var self = this;

  if (_.isArray(args.instanceIds)) {
    for (var i in args.instanceIds) {
      self._query['InstanceId.' + i] = _.asString(args.instanceIds[i]);
    }
  }

  if (null != args.force) {
    self._query['Force'] = (args.force) ? 'true' : 'false';
  }
}

util.inherits(Request, ec2.Request);

/**
 * StopInstancesResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self          = this;
  var xmlInstances  = self._xml.find('/StopInstancesResponse/instancesSet/item');
  self.instances    = [];

  for (var i in xmlInstances) {
    var instance                = _.xmlToJson(xmlInstances[i]);
    instance.currentState.code  = _.asInteger(instance.currentState.code);
    instance.previousState.code = _.asInteger(instance.previousState.code);

    self.instances.push(instance);
  }
}

util.inherits(Response, ec2.Response);
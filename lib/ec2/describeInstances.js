var
  util = require('util'),
  ec2 = require('../ec2'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET DescribeInstances
 */
var Request = module.exports.Request = function(args) {
  ec2.DescribeRequest.call(this, args, 'DescribeInstances');

  var self = this;

  if (_.isArray(args.instanceIds)) {
    for (var i in args.instanceIds) {
      self._query['InstanceId.' + i] = args.instanceIds[i];
    }
  }
}

util.inherits(Request, ec2.DescribeRequest);

/**
 * DescribeInstancesResponse
 */
var Response = module.exports.Response = function(response) {
  ec2.Response.call(this, response);

  var self            = this;
  var xmlReservations = self._xml.find('/DescribeInstancesResponse/reservationSet/item');
  self.reservations   = [];

  for (var i in xmlReservations) {
    var xmlReservation  = xmlReservations[i];
    var xmlGroups       = xmlReservation.find('./groupSet/item');
    var xmlInstances    = xmlReservation.find('./instancesSet/item');
    var groups          = [];
    var instances       = [];

    for (var j in xmlGroups) {
      groups.push(_.xmlToJson(xmlGroups[j]));
    }

    for (var j in xmlInstances) {
      var xmlInstance       = xmlInstances[j];
      var xmlProductCodes   = xmlInstance.find('./productCodes/item');
      var xmlInstanceGroups = xmlInstance.find('./groupSet/item');
      var xmlBlockDevices   = xmlInstance.find('./blockDeviceMapping/item');
      var xmlTags           = xmlInstance.find('./tagSet/item');
      var instance          = _.xmlToJson(xmlInstance);
      var productCodes      = [];
      var instanceGroups    = [];
      var blockDevices      = [];
      var tags              = [];

      for (var k in xmlProductCodes) {
        productCodes.push(_.xmlToJson(xmlProductCodes[k]));
      }

      for (var k in xmlInstanceGroups) {
        instanceGroups.push(_.xmlToJson(xmlInstanceGroups[k]));
      }

      for (var k in xmlBlockDevices) {
        var blockDevice                     = _.xmlToJson(xmlBlockDevices[k]);
        blockDevice.ebs.attachTime          = new Date(blockDevice.ebs.attachTime);
        blockDevice.ebs.deleteOnTermination = _.asBoolean(blockDevice.ebs.deleteOnTermination);

        blockDevices.push(blockDevice);
      }

      instances.push({
        instanceId: instance.instanceId,
        imageId: instance.imageId,
        instanceState: {
          code: _.asInteger(instance.instanceState),
          name: instance.instanceState.name,
        },
        privateDnsName: instance.privateDnsName,
        dnsName: instance.dnsName,
        reason: instance.reason,
        keyName: instance.keyName,
        amiLaunchIndex: instance.amiLaunchIndex,
        productCodes: productCodes,
        instanceType: instance.instanceType,
        launchTime: new Date(instance.launchTime),
        placement: instance.placement,
        kernelId: instance.kernelId,
        monitoring: instance.monitoring,
        groups: instanceGroups,
        stateReason: instance.stateReason,
        architecture: instance.architecture,
        rootDeviceType: instance.rootDeviceType,
        rootDeviceName: instance.rootDeviceName,
        blockDeviceMapping: blockDevices,
        virtualizationType: instance.virtualizationType,
        clientToken: instance.clientToken,
        hypervisor: instance.hypervisor,
      });
    }

    self.reservations.push({
      reservationId: _.xmlToJson(xmlReservation.get('./reservationId')),
      ownerId: _.xmlToJson(xmlReservation.get('./ownerId')),
      groups: groups,
      instances: instances,
      requesterId: _.xmlToJson(xmlReservation.get('./requesterId')),
    });
  }
}

util.inherits(Response, ec2.Response);
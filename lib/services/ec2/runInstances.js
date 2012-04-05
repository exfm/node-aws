/**
 * GET RunInstances
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
	
    request.query['Action'] = 'RunInstances';
    if ('undefined' !== typeof args.imageId) {
        request.query['ImageId'] = args.imageId;        
    }
    if ('undefined' !== typeof args.imageId) {
        request.query['MinCount'] = args.minCount;
    }
    if ('undefined' !== typeof args.imageId) {
        request.query['MaxCount'] = args.maxCount;
    }
    if ('undefined' !== typeof args.keyName) {
        request.query['KeyName'] = args.keyName;
    }
    if ('undefined' !== typeof args.instanceType) {
        request.query['InstanceType'] = args.instanceType;
    }
    
    if ('undefined' !== typeof args.userData) {
        request.query['UserData'] = args.userData;
    }
    
    if (Array.isArray(args.securityGroups)) {
        for (var i in args.securityGroups) {
          request.query['SecurityGroup.' + i] = args.securityGroups[i];
        }
    }
    
    
    if (Array.isArray(args.blockDeviceMapping)) {
        for (var i in args.blockDeviceMapping) {
          request.query['BlockDeviceMapping.' + i + '.DeviceName'] = args.blockDeviceMapping[i].deviceName;
          if ('undefined' !== typeof args.blockDeviceMapping[i].ebs)
          {
            request.query['BlockDeviceMapping.' + i + '.Ebs.VolumeSize'] = args.blockDeviceMapping[i].ebs.volumeSize;
          }                        
        }
    }
    
    if (Array.isArray(args.securityGroupIds)) {
        for (var i in args.securityGroupIds) {
          request.query['SecurityGroupId.' + i] = args.securityGroupIds[i];
        }
    }
    
}

/**
 * StartInstancesResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {

    response.data.instances = [];

    response.xml.find('/RunInstancesResponse/instancesSet/item').forEach(function(xmlInstance) {
      var instance                = response.xmlToJson(xmlInstance);
      response.data.instances.push(instance);
    });
}
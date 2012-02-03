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
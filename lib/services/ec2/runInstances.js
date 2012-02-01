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
        request.query['KeyName'] = args.KeyName;
    }
}

/**
 * StartInstancesResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
    response.data.instance = [];
    console.log(response.xml);
}
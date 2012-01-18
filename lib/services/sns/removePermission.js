/**
 * GET RemovePermission
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'RemovePermission';

  if ('undefined' !== typeof args.label) {
    request.query['Label'] = args.label;
  }

  if ('undefined' !== typeof args.topicArn) {
    request.query['TopicArn'] = args.topicArn;
  }
};

/**
 * RemovePermissionResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
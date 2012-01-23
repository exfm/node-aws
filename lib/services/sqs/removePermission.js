/**
 * GET RemovePermission
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'RemovePermission';

  request.encodeQueueUrl(args);

  if ('undefined' !== typeof args.label) {
    request.query['Label'] = args.label;
  }
};

/**
 * RemovePermissionResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
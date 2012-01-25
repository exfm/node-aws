/**
 * GET AddPermission
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'AddPermission';

  request.encodeQueueUrl(args);

  if (Array.isArray(args.awsAccountIds) {
    for (var i = 0; i < args.awsAccountIds.length; i++) {
      request.query['AWSAccountId.' + (i + 1)] = args.awsAccountIds[i];
    }
  }

  if (Array.isArray(args.actionNames) {
    for (var i = 0; i < args.actionNames.length; i++) {
      request.query['ActionName.' + (i + 1)] = args.actionNames[i];
    }
  }

  if ('undefined' !== typeof args.label) {
    request.query['Label'] = args.label;
  }
};

/**
 * AddPermissionResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
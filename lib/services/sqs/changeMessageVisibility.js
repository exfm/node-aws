/**
 * GET ChangeMessageVisibility
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'ChangeMessageVisibility';

  request.encodeQueueUrl(args);

  if ('undefined' !== typeof args.receiptHandle) {
    request.query['ReceiptHandle'] = args.receiptHandle;
  }

  if ('undefined' !== typeof args.visibilityTimeout) {
    request.query['VisibilityTimeout'] = args.visibilityTimeout;
  }
};

/**
 * ChangeMessageVisibilityResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
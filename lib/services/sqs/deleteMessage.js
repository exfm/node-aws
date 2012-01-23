/**
 * GET DeleteMessage
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DeleteMessage';

  request.encodeQueueUrl(args);

  if ('undefined' !== typeof args.receiptHandle) {
    request.query['ReceiptHandle'] = args.receiptHandle;
  }
};

/**
 * DeleteMessageResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
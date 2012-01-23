/**
 * GET GetQueueUrl
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'GetQueueUrl';

  if ('undefined' !== typeof args.queueName) {
    request.query['QueueName'] = args.queueName;
  }

  if ('undefined' !== typeof args.queueOwnerAwsAccountId) {
    request.query['QueueOwnerAWSAccountId'] = args.queueOwnerAwsAccountId;
  }
};

/**
 * CreateQueueResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  response.data.queueUrl = response.xmlToJson(response.xml.get('/GetQueueUrlResponse/GetQueueUrlResult/QueueUrl'));
};
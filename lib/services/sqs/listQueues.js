/**
 * GET ListQueues
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'ListQueues';

  if ('undefined' !== typeof args.queueNamePrefix) {
    request.query['QueueNamePrefix'] = args.queueNamePrefix;
  }
};

/**
 * ListQueuesResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  response.data.queueUrls = [];

  response.xml.find('/ListQueuesResponse/ListQueuesResult/QueueUrl').forEach(function(xmlQueueUrl) {
    response.data.queueUrls.push(response.xmlToJson(xmlQueueUrl));
  });
};
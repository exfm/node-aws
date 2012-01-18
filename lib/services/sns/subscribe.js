/**
 * GET Subscribe
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'Subscribe';

  if ('undefined' !== typeof args.endpoint) {
    request.query['Endpoint'] = args.endpoint;
  }

  if ('undefined' !== typeof args.protocol) {
    request.query['Protocol'] = args.protocol;
  }

  if ('undefined' !== typeof args.topicArn) {
    request.query['TopicArn'] = args.topicArn;
  }
}

/**
 * SubscribeResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  response.data.subscriptionArn = response.xmlToJson(response.xml.get('/SubscribeResponse/SubscribeResult/SubscriptionArn'));
}
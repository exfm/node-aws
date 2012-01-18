/**
 * GET ConfirmSubscription
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'ConfirmSubscription';

  if ('undefined' !== typeof args.authenticateOnUnsubscribe) {
    request.query['AuthenticateOnUnsubscribe'] = args.authenticateOnUnsubscribe;
  }

  if ('undefined' !== typeof args.token) {
    request.query['Token'] = args.token;
  }

  if ('undefined' !== typeof args.topicArn) {
    request.query['TopicArn'] = args.topicArn;
  }
}

/**
 * ConfirmSubscriptionResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  response.data.subscriptionArn = response.xmlToJson(response.xml.get('/ConfirmSubscriptionResponse/ConfirmSubscriptionResult/SubscriptionArn'));
}
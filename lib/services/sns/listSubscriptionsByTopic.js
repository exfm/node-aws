/**
 * GET ListSubscriptionsByTopic
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'ListSubscriptionsByTopic';

  if ('undefined' !== typeof args.nextToken) {
    request.query['NextToken'] = args.nextToken;
  }

  if ('undefined' !== typeof args.topicArn) {
    request.query['TopicArn'] = args.topicArn;
  }
}

/**
 * ListSubscriptionsByTopicResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var xmlResult               = response.xml.get('/ListSubscriptionsByTopicResponse/ListSubscriptionsByTopicResult');
  response.data.subscriptions = [];

  xmlResult.find('./Subscriptions/member').forEach(function(xmlSubscription) {
    var subscription = response.xmlToJson(xmlSubscription);

    response.data.topics.push({
      topicArn: subscription.TopicArn,
      protocol: subscription.Protocol,
      subscriptionArn: subscription.SubscriptionArn,
      owner: subscription.Owner,
      endpoint: subscription.Endpoint,
    });
  });

  response.data.nextToken = response.xmlToJson(xmlResult.get('./NextToken'))
}
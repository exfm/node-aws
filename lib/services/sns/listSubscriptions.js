/**
 * GET ListSubscriptions
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'ListSubscriptions';

  if ('undefined' !== typeof args.nextToken) {
    request.query['NextToken'] = args.nextToken;
  }
}

/**
 * ListSubscriptionsResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var xmlResult               = response.xml.get('/ListSubscriptionsResponse/ListSubscriptionsResult');
  response.data.subscriptions = [];

  xmlResult.find('./Subscriptions/member').forEach(function(xmlSubscription) {
    var subscription = response.xmlToJson(xmlSubscription);

    response.data.subscriptions.push({
      topicArn: subscription.TopicArn,
      protocol: subscription.Protocol,
      subscriptionArn: subscription.SubscriptionArn,
      owner: subscription.Owner,
      endpoint: subscription.Endpoint,
    });
  });

  response.data.nextToken = response.xmlToJson(xmlResult.get('./NextToken'))
}
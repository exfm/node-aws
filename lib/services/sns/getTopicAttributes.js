/**
 * GET GetTopicAttributes
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'GetTopicAttributes';

  if ('undefined' !== typeof args.topicArn) {
    request.query['TopicArn'] = args.topicArn;
  }
}

/**
 * GetTopicAttributesResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  response.data.attributes = [];

  response.xml.find('/GetTopicAttributesResponse/GetTopicAttributesResult/Attributes/entry').forEach(function(xmlAttribute) {
    var attribute = response.xmlToJson(xmlAttribute);

    switch (attribute.key) {
      case 'SubscriptionsPending':
      case 'SubscriptionsConfirmed':
      case 'SubscriptionsDeleted':
        attribute.value = parseInt(attribute.value);
        break;
      case 'Policy':
      case 'DeliveryPolicy':
      case 'EffectiveDeliveryPolicy':
        attribute.value = JSON.parse(attribute.value);
        break;
    }

    response.data.attributes.push(attribute);
  });
}
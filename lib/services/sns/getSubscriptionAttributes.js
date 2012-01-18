/**
 * GET GetSubscriptionAttributes
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'GetSubscriptionAttributes';

  if ('undefined' !== typeof args.subscriptionArn) {
    request.query['SubscriptionArn'] = args.subscriptionArn;
  }
}

/**
 * GetSubscriptionAttributesResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  response.data.attributes = [];

  response.xml.find('/GetSubscriptionAttributesResponse/GetSubscriptionAttributesResult/Attributes/entry').forEach(function(xmlAttribute) {
    var attribute = response.xmlToJson(xmlAttribute);

    switch (attribute.key) {
      case 'ConfirmationWasAuthenticated':
        attribute.value = 'true' === attribute.value;
        break;
      case 'DeliveryPolicy':
      case 'EffectiveDeliveryPolicy':
        attribute.value = JSON.parse(attribute.value);
        break;
    }

    response.data.attributes.push(attribute);
  });
}
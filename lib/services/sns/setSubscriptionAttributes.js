/**
 * GET SetSubscriptionAttributes
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'SetSubscriptionAttributes';

  if ('undefined' !== typeof args.subscriptionArn) {
    request.query['SubscriptionArn'] = args.subscriptionArn;
  }

  if ('undefined' !== typeof args.attributeName) {
    request.query['AttributeName'] = args.attributeName;
  }

  if ('undefined' !== typeof args.attributeValue) {
    switch (args.attributeName) {
      case 'DeliveryPolicy': {
        if ('object' === typeof args.attributeValue && !(args.attributeValue instanceof String)) {
          args.attributeValue = JSON.stringify(args.attributeValue);
        }

        break;
      }
    }

    request.query['AttributeValue'] = args.attributeValue;
  }
};

/**
 * SetSubscriptionAttributesResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
/**
 * GET SetTopicAttributes
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'SetTopicAttributes';

  if ('undefined' !== typeof args.topicArn) {
    request.query['TopicArn'] = args.topicArn;
  }

  if ('undefined' !== typeof args.attributeName) {
    request.query['AttributeName'] = args.attributeName;
  }

  if ('undefined' !== typeof args.attributeValue) {
    switch (args.attributeName) {
      case 'Policy':
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
 * SetTopicAttributesResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
var util = require('util');

/**
 * GET GetQueueAttributes
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'GetQueueAttributes';

  request.encodeQueueUrl(args);

  if (util.isArray(args.attributeNames)) {
    for (var i = 0; i < args.attributeNames.length; i++) {
      request.query['AttributeName.' + (i + 1)] = args.attributeNames[i];
    }
  }
}

/**
 * GetQueueAttributesResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  response.data.attributes = [];

  response.xml.find('/GetQueueAttributesResponse/GetQueueAttributesResult/Attribute').forEach(function(xmlAttribute) {
    var attribute = response.xmlToJson(xmlAttribute);

    switch (attribute.Name) {
      case 'VisibilityTimeout':
      case 'ApproximateNumberOfMessages':
      case 'ApproximateNumberOfMessagesNotVisible':
      case 'ApproximateNumberOfMessagesDelayed':
      case 'MaximumMessageSize':
      case 'MessageRetentionPeriod':
      case 'DelaySeconds':
        attribute.Value = parseInt(attribute.Value);
        break;
      case 'CreatedTimestamp':
      case 'LastModifiedTimestamp':
      case 'EffectiveDeliveryPolicy':
        attribute.Value = new Date(attribute.Value * 1000);
        break;
      case 'Policy':
        attribute.Value = JSON.parse(attribute.Value);
        break;
    }

    response.data.attributes.push({
      name: attribute.Name,
      value: attribute.Value,
    });
  });
}
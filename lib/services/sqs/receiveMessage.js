/**
 * GET ReceiveMessage
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'ReceiveMessage';

  request.encodeQueueUrl(args);

  if (Array.isArray(args.attributeNames)) {
    for (var i = 0; i < args.attributeNames.length; i++) {
      request.query['AttributeName.' + (i + 1)] = args.attributeNames[i];
    }
  }

  if ('undefined' !== typeof args.maxNumberOfMessages) {
    request.query['MaxNumberOfMessages'] = args.maxNumberOfMessages;
  }

  if ('undefined' !== typeof args.visibilityTimeout) {
    request.query['VisibilityTimeout'] = args.visibilityTimeout;
  }
};

/**
 * ReceiveMessageResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var xmlMessage  = response.xml.get('/ReceiveMessageResponse/ReceiveMessageResult/Message');
  var message     = response.xmlToJson(xmlMessage);

  if (null == message) {
    return;
  }

  response.data.message = {
    body: message.Body,
    md5OfBody: message.MD5OfBody,
    messageId: message.MessageId,
    receiptHandle: message.ReceiptHandle,
    attributes: [],
  };

  xmlMessage.find('./Attribute').forEach(function(xmlAttribute) {
    var attribute = response.xmlToJson(xmlAttribute);

    switch (attribute.Name) {
      case 'ApproximateReceiveCount':
        attribute.Value = parseInt(attribute.Value);
        break;
      case 'SentTimestamp':
      case 'ApproximateFirstReceiveTimestamp':
        attribute.Value = new Date(parseInt(attribute.Value));
        break;
    }

    response.data.message.attributes.push({
      name: attribute.Name,
      value: attribute.Value,
    });
  });
};
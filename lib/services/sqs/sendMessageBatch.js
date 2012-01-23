/**
 * GET SendMessageBatch
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'SendMessageBatch';

  request.encodeQueueUrl(args);

  if (Array.isArray(args.sendMessageBatchRequestEntries)) {
    var entries = args.sendMessageBatchRequestEntries;

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];

      if ('undefined' !== typeof entry.id) {
        request.query['SendMessageBatchRequestEntry.' + (i + 1) + '.Id'] = entry.id;
      }

      if ('undefined' !== typeof entry.messageBody) {
        request.query['SendMessageBatchRequestEntry.' + (i + 1) + '.MessageBody'] = entry.messageBody;
      }

      if ('undefined' !== typeof entry.delaySeconds) {
        request.query['SendMessageBatchRequestEntry.' + (i + 1) + '.DelaySeconds'] = entry.delaySeconds;
      }
    }
  }
};

/**
 * SendMessageBatchResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var result = response.xml.get('/SendMessageBatchResponse/SendMessageBatchResult');

  response.data.sendMessageBatchResultEntries = [];
  response.data.batchResultErrorEntries       = [];

  result.find('./SendMessageBatchResultEntry').forEach(function(xmlEntry) {
    var entry = response.xmlToJson(xmlEntry);

    response.data.sendMessageBatchResultEntries.push({
      id: entry.Id,
      messageId: entry.MessageId,
      md5OfMessageBody: entry.MD5OfMessageBody,
    });
  });

  result.find('./BatchResultErrorEntry').forEach(function(xmlEntry) {
    var entry = response.xmlToJson(xmlEntry);

    response.data.batchResultErrorEntries.push({
      id: entry.Id,
      senderFault: 'true' === entry.SenderFault,
      code: entry.Code,
      message: entry.Message,
    });
  });
};
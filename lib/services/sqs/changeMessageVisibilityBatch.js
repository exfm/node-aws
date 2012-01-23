/**
 * GET ChangeMessageVisibilityBatch
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'ChangeMessageVisibilityBatch';

  request.encodeQueueUrl(args);

  if (Array.isArray(args.changeMessageVisibilityBatchRequestEntries)) {
    var entries = args.changeMessageVisibilityBatchRequestEntries;

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];

      if ('undefined' !== typeof entry.id) {
        request.query['ChangeMessageVisibilityBatchRequestEntry.' + (i + 1) + '.Id'] = entry.id;
      }

      if ('undefined' !== typeof entry.receiptHandle) {
        request.query['ChangeMessageVisibilityBatchRequestEntry.' + (i + 1) + '.ReceiptHandle'] = entry.receiptHandle;
      }

      if ('undefined' !== typeof entry.visibilityTimeout) {
        request.query['ChangeMessageVisibilityBatchRequestEntry.' + (i + 1) + '.VisibilityTimeout'] = entry.visibilityTimeout;
      }
    }
  }
};

/**
 * ChangeMessageVisibilityBatchResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var result = response.xml.get('/ChangeMessageVisibilityBatchResponse/ChangeMessageVisibilityBatchResult');

  response.data.changeMessageVisibilityBatchResultEntries = [];
  response.data.batchResultErrorEntries                   = [];

  result.find('./ChangeMessageVisibilityBatchResultEntry').forEach(function(xmlEntry) {
    var entry = response.xmlToJson(xmlEntry);

    response.data.deleteMessageBatchResultEntries.push({
      id: entry.Id,
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
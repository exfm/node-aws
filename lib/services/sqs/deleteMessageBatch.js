/**
 * GET DeleteMessageBatch
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DeleteMessageBatch';

  request.encodeQueueUrl(args);

  if (Array.isArray(args.deleteMessageBatchRequestEntries)) {
    var entries = args.deleteMessageBatchRequestEntries;

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];

      if ('undefined' !== typeof entry.id) {
        request.query['DeleteMessageBatchRequestEntry.' + (i + 1) + '.Id'] = entry.id;
      }

      if ('undefined' !== typeof entry.receiptHandle) {
        request.query['DeleteMessageBatchRequestEntry.' + (i + 1) + '.ReceiptHandle'] = entry.receiptHandle;
      }
    }
  }
};

/**
 * DeleteMessageBatchResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var result = response.xml.get('/DeleteMessageBatchResponse/DeleteMessageBatchResult');

  response.data.deleteMessageBatchResultEntries = [];
  response.data.batchResultErrorEntries         = [];

  result.find('./DeleteMessageBatchResultEntry').forEach(function(xmlEntry) {
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
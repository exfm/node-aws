/**
 * GET Publish
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'Publish';

  if ('undefined' !== typeof args.message) {
    if ('object' === typeof args.message && !(args.message instanceof String)) {
      args.messageStructure = 'json';
      args.message          = JSON.stringify(args.message);
    }

    request.query['Message'] = args.message;
  }

  if ('undefined' !== typeof args.messageStructure) {
    request.query['MessageStructure'] = args.messageStructure;
  }

  if ('undefined' !== typeof args.subject) {
    request.query['Subject'] = args.subject;
  }

  if ('undefined' !== typeof args.topicArn) {
    request.query['TopicArn'] = args.topicArn;
  }
}

/**
 * PublishResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  response.data.messageId = response.xmlToJson(response.xml.get('/PublishResponse/PublishResult/MessageId'));
}
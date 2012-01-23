/**
 * GET SendMessage
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'SendMessage';

  request.encodeQueueUrl(args);

  if ('undefined' !== typeof args.messageBody) {
    request.query['MessageBody'] = args.messageBody;
  }

  if ('undefined' !== typeof args.delaySeconds) {
    request.query['DelaySeconds'] = args.delaySeconds;
  }
};

/**
 * SendMessageResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var result = response.xmlToJson(response.xml.get('/SendMessageResponse/SendMessageResult'));

  response.data.messageId         = result.MessageId;
  response.data.md5OfMessageBody  = result.MD5OfMessageBody;
};
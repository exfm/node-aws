/**
 * GET CreateTopic
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'CreateTopic';

  if ('undefined' !== typeof args.name) {
    request.query['Name'] = args.name;
  }
}

/**
 * CreateTopicResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  response.data.topicArn = response.xmlToJson(response.xml.get('/CreateTopicResponse/CreateTopicResult/TopicArn'));
}
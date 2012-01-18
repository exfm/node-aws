/**
 * GET ListTopics
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'ListTopics';

  if ('undefined' !== typeof args.nextToken) {
    request.query['NextToken'] = args.nextToken;
  }
}

/**
 * ListTopicsResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var xmlResult         = response.xml.get('/ListTopicsResponse/ListTopicsResult');
  response.data.topics  = [];

  xmlResult.find('./Topics/member/TopicArn').forEach(function(xmlTopicArn) {
    response.data.topics.push({
      topicArn: response.xmlToJson(xmlTopicArn),
    });
  });

  response.data.nextToken = response.xmlToJson(xmlResult.get('./NextToken'))
}
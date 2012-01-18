/**
 * GET DeleteTopic
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DeleteTopic';

  if ('undefined' !== typeof args.topicArn) {
    request.query['TopicArn'] = args.topicArn;
  }
}

/**
 * DeleteTopicResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
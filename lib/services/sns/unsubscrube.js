/**
 * GET Unsubscribe
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'Unsubscribe';

  if ('undefined' !== typeof args.subscriptionArn) {
    request.query['SubscriptionArn'] = args.subscriptionArn;
  }
};

/**
 * UnsubscribeResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
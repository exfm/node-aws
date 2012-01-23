/**
 * GET DeleteQueue
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DeleteQueue';

  request.encodeQueueUrl(args);
};

/**
 * DeleteQueueResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
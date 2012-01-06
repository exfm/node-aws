/**
 * GET DeleteDomain
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DeleteDomain';

  if ('undefined' !== typeof args.domainName) {
    request.query['DomainName'] = args.domainName;
  }
}

/**
 * DeleteDomainResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
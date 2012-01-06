/**
 * GET CreateDomain
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'CreateDomain';

  if ('undefined' !== typeof args.domainName) {
    request.query['DomainName'] = args.domainName;
  }
}

/**
 * CreateDomainResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
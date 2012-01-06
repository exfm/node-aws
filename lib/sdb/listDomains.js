/**
 * GET ListDomains
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'ListDomains';

  if ('undefined' !== typeof args.maxNumberOfDomains) {
    request.query['MaxNumberOfDomains'] = args.maxNumberOfDomains;
  }

  if ('undefined' !== typeof args.nextToken) {
    request.query['NextToken'] = args.nextToken;
  }
}

/**
 * ListDomainsResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var xmlResult             = response.xml.get('/ListDomainsResponse/ListDomainsResult');
  response.data.domainNames = [];

  xmlResult.find('./DomainName').forEach(function(xmlDomainName) {
    response.data.domainNames.push(response.xmlToJson(xmlDomainName));
  });

  response.data.nextToken = response.xmlToJson(xmlResult.get('./NextToken'))
}
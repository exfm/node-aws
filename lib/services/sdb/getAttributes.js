/**
 * GET GetAttributes
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'GetAttributes';

  if ('undefined' !== typeof args.domainName) {
    request.query['DomainName'] = args.domainName;
  }

  if ('undefined' !== typeof args.itemName) {
    request.query['ItemName'] = args.itemName;
  }

  if ('undefined' !== typeof args.consistentRead) {
    request.query['ConsistentRead'] = args.consistentRead;
  }

  if (Array.isArray(args.attributeNames)) {
    for (var i in args.attributeNames) {
      request.query['AttributeName.' + i] = args.attributeNames[i];
    }
  }
}

/**
 * GetAttributesResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  response.data.attributes = [];

  response.xml.find('/GetAttributesResponse/GetAttributesResult/Attribute').forEach(function(xmlAttribute) {
    var attribute = response.xmlToJson(xmlAttribute);

    response.data.attributes.push({
      name: attribute.Name,
      value: attribute.Value,
    });
  });
}
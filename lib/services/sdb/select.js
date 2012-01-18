/**
 * GET Select
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'Select';

  if ('undefined' !== typeof args.selectExpression) {
    request.query['SelectExpression'] = args.selectExpression;
  }

  if ('undefined' !== typeof args.consistentRead) {
    request.query['ConsistentRead'] = args.consistentRead;
  }

  if ('undefined' !== typeof args.nextToken) {
    request.query['NextToken'] = args.nextToken;
  }
}

/**
 * SelectResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var xmlResult       = response.xml.get('/SelectResponse/SelectResult');
  response.data.items = [];

  xmlResult.find('./Item').forEach(function(xmlItem) {
    var item = {
      name: response.xmlToJson(xmlItem.get('./Name')),
      attributes: [],
    };

    xmlItem.find('./Attribute').forEach(function(xmlAttribute) {
      var xmlName           = xmlAttribute.get('./Name');
      var xmlValue          = xmlAttribute.get('./Value');
      var xmlNameEncoding   = xmlName.attr('encoding');
      var xmlValueEncoding  = xmlValue.attr('encoding');
      var name              = response.xmlToJson(xmlName);
      var value             = response.xmlToJson(xmlValue);

      if (xmlValueEncoding && 'base64' == xmlValueEncoding.value()) {
        var buffer  = new Buffer(value, 'base64');
        value       = buffer.toString();
      }

      item.attributes.push({
        name: name,
        value: value,
      });
    });

    response.data.items.push(item);
  });

  response.data.nextToken = response.xmlToJson(xmlResult.get('./NextToken'));
}
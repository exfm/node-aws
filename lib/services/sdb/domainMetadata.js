/**
 * GET DomainMetadata
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DomainMetadata';

  if ('undefined' !== typeof args.domainName) {
    request.query['DomainName'] = args.domainName;
  }
}

/**
 * DomainMetadataResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var metadata = response.xmlToJson(response.xml.get('/DomainMetadataResponse/DomainMetadataResult'));

  response.data.itemCount                = parseInt(metadata.ItemCount);
  response.data.itemNamesSizeBytes       = parseInt(metadata.ItemNamesSizeBytes);
  response.data.attributeNameCount       = parseInt(metadata.AttributeNameCount);
  response.data.attributeNamesSizeBytes  = parseInt(metadata.AttributeNamesSizeBytes);
  response.data.attributeValueCount      = parseInt(metadata.AttributeValueCount);
  response.data.attributeValuesSizeBytes = parseInt(metadata.AttributeValuesSizeBytes);
  response.data.timestamp                = parseInt(metadata.Timestamp);
}
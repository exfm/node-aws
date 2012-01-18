/**
 * GET ListResourceRecordSets
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method = 'GET';

  /*if (!route53.matchHostedZone(args.id)) {
    throw new aws.ServiceError(null, '"' + args.id + '" is not a valid id', 'InvalidArgument');
  }*/

  var query = {}

  if ('undefined' !== typeof args.type) {
    query.type = args.type;
  }

  if ('undefined' !== typeof args.name) {
    query.name = args.name;
  }

  if ('undefined' !== typeof args.maxItems) {
    query.maxitems = args.maxItems;
  }

  request.path += args.id + '/rrset?' + request.stringifyQuery(query);
}

/**
 * ListResourceRecordSetsResponse
 *
 * @param   {Object}  response
 */
module.exports.decodeResponse = function(response) {
  var xml                           = response.xml.get('/ListResourceRecordSetsResponse');
  response.data.resourceRecordSets  = [];

  xml.find('./ResourceRecordSets/ResourceRecordSet').forEach(function(xmlResourceRecordSet) {
    var resourceRecordSet = {
      name: response.xmlToJson(xmlResourceRecordSet.get('./Name')),
      type: response.xmlToJson(xmlResourceRecordSet.get('./Type')),
      ttl: parseInt(response.xmlToJson(xmlResourceRecordSet.get('./TTL'))),
      resourceRecords: [],
    };

    xmlResourceRecordSet.find('./ResourceRecords/ResourceRecord/Value').forEach(function(xmlResourceRecord) {
      resourceRecordSet.resourceRecords.push(response.xmlToJson(xmlResourceRecord));
    });
    
    response.data.resourceRecordSets.push(resourceRecordSet);
  });

  response.data.isTruncated     = 'true' === response.xmlToJson(xml.get('./IsTruncated'));
  response.data.maxItems        = parseInt(response.xmlToJson(xml.get('./MaxItems')));
  response.data.nextRecordName  = response.xmlToJson(xml.get('./NextRecordName'));
  response.data.nextRecordType  = response.xmlToJson(xml.get('./NextRecordType'));
}
var
  util = require('util'),
  querystring = require('querystring'),
  aws = require('../aws'),
  route53 = require('../route53');

/**
 * GET ListResourceRecordSets
 *
 * @param   {Object}  args
 */
var Request = function(args) {
  route53.Request.call(this, Response, args, 'GET');

  var self  = this;
  var query = {}

  if (!aws.isString(args.id)) {
    throw new Error('args.id is a required string');
  }

  if (!args.id.match(/^\/hostedzone\/[A-Z0-9]+$/)) {
    throw new Error('args.id is not a valid id');
  }

  if (null != args.type) {
    if (!aws.isString(args.type)) {
      throw new Error('args.type must be a string');
    } else {
      query.type = args.type;
    }
  }

  if (null != args.name) {
    if (!aws.isString(args.name)) {
      throw new Error('args.name must be a string');
    } else {
      query.name = args.name;
    }
  }

  if (null != args.maxItems) {
    if (!aws.isNumber(args.maxItems)) {
      throw new Error('args.maxItems must be a number');
    } else {
      query.maxitems = args.maxItems = parseInt(args.maxItems);
    }
  }

  self._path += args.id + '/rrset?' + querystring.stringify(query);
}

util.inherits(Request, route53.Request);

/**
 * ListResourceRecordSetsResponse
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = function(headers, data) {
  route53.Response.call(this, headers, data);

  var self                  = this;
  var xmlRoot               = self._xml.get('/ListResourceRecordSetsResponse');
  var xmlResourceRecordSets = xmlRoot.find('./ResourceRecordSets/ResourceRecordSet');
  self.resourceRecordSets   = [];

  for (var i in xmlResourceRecordSets) {
    var xmlResourceRecordSet  = xmlResourceRecordSets[i];
    var xmlResourceRecords    = xmlResourceRecordSet.find('./ResourceRecords/ResourceRecord/Value');
    var resourceRecordSet     = {
      name: aws.xmlToJSON(xmlResourceRecordSet.get('./Name')),
      type: aws.xmlToJSON(xmlResourceRecordSet.get('./Type')),
      ttl: aws.xmlToJSON(xmlResourceRecordSet.get('./TTL')),
      resourceRecords: [],
    };

    for (var j in xmlResourceRecords) {
      resourceRecordSet.resourceRecords.push(aws.xmlToJSON(xmlResourceRecords[j]));
    }
    
    self.resourceRecordSets.push(resourceRecordSet);
  }

  self.isTruncated        = 'true' == aws.xmlToJSON(xmlRoot.get('./IsTruncated'));
  self.maxItems           = aws.xmlToJSON(xmlRoot.get('./MaxItems'));
  self.nextRecordName     = aws.xmlToJSON(xmlRoot.get('./NextRecordName'));
  self.nextRecordType     = aws.xmlToJSON(xmlRoot.get('./NextRecordType'));
}

util.inherits(Response, route53.Response);

module.exports.Request  = Request;
module.exports.Response = Response;
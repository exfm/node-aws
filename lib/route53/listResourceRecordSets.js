var
  util = require('util'),
  route53 = require('../route53'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET ListResourceRecordSets
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  route53.Request.call(this, args, 'GET');

  if (!route53.matchHostedZone(args.id)) {
    throw new aws.ServiceError(null, '"' + args.id + '" is not a valid id', 'InvalidArgument');
  }

  var self  = this;
  var query = {}

  if (null != args.type) {
    query.type = _.asString(args.type);
  }

  if (null != args.name) {
    query.name = _.asString(args.name);
  }

  if (null != args.maxItems) {
    query.maxitems = _.asString(parseInt(args.maxItems));
  }

  self._path += _.asString(args.id) + '/rrset?' + _.stringifyQuery(query);
}

util.inherits(Request, route53.Request);

/**
 * ListResourceRecordSetsResponse
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  route53.Response.call(this, response);

  var self                  = this;
  var xmlRoot               = self._xml.get('/ListResourceRecordSetsResponse');
  var xmlResourceRecordSets = xmlRoot.find('./ResourceRecordSets/ResourceRecordSet');
  self.resourceRecordSets   = [];

  for (var i in xmlResourceRecordSets) {
    var xmlResourceRecordSet  = xmlResourceRecordSets[i];
    var xmlResourceRecords    = xmlResourceRecordSet.find('./ResourceRecords/ResourceRecord/Value');
    var resourceRecordSet     = {
      name: _.xmlToJson(xmlResourceRecordSet.get('./Name')),
      type: _.xmlToJson(xmlResourceRecordSet.get('./Type')),
      ttl: _.asInteger(_.xmlToJson(xmlResourceRecordSet.get('./TTL'))),
      resourceRecords: [],
    };

    for (var j in xmlResourceRecords) {
      resourceRecordSet.resourceRecords.push(_.xmlToJson(xmlResourceRecords[j]));
    }
    
    self.resourceRecordSets.push(resourceRecordSet);
  }

  self.isTruncated        = _.asBoolean(_.xmlToJson(xmlRoot.get('./IsTruncated')));
  self.maxItems           = _.asInteger(_.xmlToJson(xmlRoot.get('./MaxItems')));
  self.nextRecordName     = _.xmlToJson(xmlRoot.get('./NextRecordName'));
  self.nextRecordType     = _.xmlToJson(xmlRoot.get('./NextRecordType'));
}

util.inherits(Response, route53.Response);
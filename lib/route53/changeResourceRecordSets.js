var
  util = require('util'),
  querystring = require('querystring'),
  libxmljs = require('libxmljs'),
  aws = require('../aws'),
  route53 = require('../route53');

/**
 * POST ChangeResourceRecordSets
 *
 * @param   {Object}  args
 */
var Request = function(args) {
  route53.Request.call(this, Response, args, 'POST');

  var self      = this;
  self._xml     = new libxmljs.Document();
  var xmlRoot   = self._xml.node('ChangeResourceRecordSetsRequest');
  var xmlBatch  = xmlRoot.node('ChangeBatch');

  xmlRoot.namespace(route53.xmlns);

  if (!aws.isString(args.id) || ) {
    throw new Error('args.id is a required string');
  }

  if (!args.id.match(/^\/hostedzone\/[A-Z0-9]+$/)) {
    throw new Error('args.id is not a valid id');
  }

  self._path += args.id + '/rrset';

  if (null != args.comment) {
    if (!aws.isString(args.comment)) {
      throw new Error('args.comment must be a string');
    }

    xmlBatch.node('Comment').text(args.comment);
  }

  if (null == args.changes || !args.changes instanceof Array || 0 == args.changes.length) {
    throw new Error('args.changes must be an Array of length > 0');
  }

  var xmlChanges = xmlBatch.node('Changes');

  for (var i in args.changes) {
    var xmlChange         = xmlChanges.node('Change');
    var change            = args.changes[i];
    var resourceRecordSet = change.resourceRecordSet;

    if (!aws.isString(change.action)) {
      throw new Error('args.changes[' + i + '].action is a required string');
    }

    xmlChange.node('Action').text(change.action);

    if (null != resourceRecordSet || !resourceRecordSet instanceof Object) {
      throw new Error('args.changes[' + i + '].resourceRecordSet is a required object');
    }

    var xmlResourceRecordSet = xmlChange.node('ResourceRecordSet');

    if (!aws.isString(resourceRecordSet.name)) {
      throw new Error('args.changes[' + i + '].resourceRecordSet.name is a required string');
    }

    xmlResourceRecordSet.node('Name').text(resourceRecordSet.name);

    if (!aws.isString(resourceRecordSet.type)) {
      throw new Error('args.changes[' + i + '].resourceRecordSet.type is a required string');
    }

    xmlResourceRecordSet.node('Type').text(resourceRecordSet.type);

    if (!aws.isNumber(resourceRecordSet.ttl)) {
      throw new Error('args.changes[' + i + '].resourceRecordSet.ttl is a required number');
    }

    xmlResourceRecordSet.node('TTL').text(parseInt(resourceRecordSet.ttl));

    var resourceRecords = resourceRecordSet.resourceRecords;

    if (null == resourceRecords || !resourceRecords instanceof Array || 0 == resourceRecords.length) {
      throw new Error('args.changes[' + i + '].resourceRecordSet.resourceRecords must be an Array of length > 0');
    }

    var xmlResourceRecords = xmlResourceRecordSet.node('ResourceRecords');

    for (var j in resourceRecords) {
      var resourceRecord = resourceRecords[j];

      if (!aws.isString(resourceRecord)) {
        throw new Error('args.changes[' + i + '].resourceRecordSet.resourceRecords[' + i + '] must be a string');
      }

      xmlResourceRecords.node('ResourceRecord').node('Value').text(resourceRecord);
    }
  }
}

util.inherits(Request, route53.Request);

/**
 * ChangeResourceRecordSetsResponse
 */
var Response = function(headers, data) {
  route53.Response.call(this, headers, data);
console.log(data);
  var self        = this;
  var xmlRoot     = self._xml.get('/ChangeResourceRecordSetsResponse');
  var changeInfo  = aws.xmlToJSON(xmlRoot.get('./ChangeInfo'));

  self.changeInfo = {
    id: changeInfo.Id,
    status: changeInfo.Status,
    submittedAt: new Date(changeInfo.SubmittedAt),
  };
}

util.inherits(Response, route53.Response);

module.exports.Request  = Request;
module.exports.Response = Response;

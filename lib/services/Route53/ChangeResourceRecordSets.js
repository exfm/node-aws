var
  util = require('util'),
  libxmljs = require('libxmljs'),
  route53 = require('../Route53'),
  aws = require('../../aws'),
  _ = require('../../util');

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

  if (!_.isString(args.id)) {
    throw new Error('args.id is a required string');
  }

  if (!args.id.match(/^\/hostedzone\/[A-Z0-9]+$/)) {
    throw new Error('args.id is not a valid id');
  }

  self._path += args.id + '/rrset';

  if (null != args.comment) {
    if (!_.isString(args.comment)) {
      throw new Error('args.comment must be a string');
    }

    xmlBatch.node('Comment').text(args.comment);
  }

  if (!_.instanceOf(args.changes, Array) || 0 == args.changes.length) {
    throw new Error('args.changes must be an Array of length > 0');
  }

  var xmlChanges = xmlBatch.node('Changes');

  for (var i in args.changes) {
    var xmlChange         = xmlChanges.node('Change');
    var change            = args.changes[i];
    var resourceRecordSet = change.resourceRecordSet;

    if (!_.isString(change.action)) {
      throw new Error('args.changes[' + i + '].action is a required string');
    }

    xmlChange.node('Action').text(change.action);

    if (!_.instanceOf(resourceRecordSet, Object)) {
      throw new Error('args.changes[' + i + '].resourceRecordSet is a required object');
    }

    var xmlResourceRecordSet = xmlChange.node('ResourceRecordSet');

    if (!_.isString(resourceRecordSet.name)) {
      throw new Error('args.changes[' + i + '].resourceRecordSet.name is a required string');
    }

    xmlResourceRecordSet.node('Name').text(resourceRecordSet.name);

    if (!_.isString(resourceRecordSet.type)) {
      throw new Error('args.changes[' + i + '].resourceRecordSet.type is a required string');
    }

    xmlResourceRecordSet.node('Type').text(resourceRecordSet.type);

    if (!_.isNumber(resourceRecordSet.ttl)) {
      throw new Error('args.changes[' + i + '].resourceRecordSet.ttl is a required number');
    }

    xmlResourceRecordSet.node('TTL').text(parseInt(resourceRecordSet.ttl));

    var resourceRecords = resourceRecordSet.resourceRecords;

    if (!_.instanceOf(resourceRecords, Array) || 0 == resourceRecords.length) {
      throw new Error('args.changes[' + i + '].resourceRecordSet.resourceRecords must be an Array of length > 0');
    }

    var xmlResourceRecords = xmlResourceRecordSet.node('ResourceRecords');

    for (var j in resourceRecords) {
      var resourceRecord = resourceRecords[j];

      if (!_.isString(resourceRecord)) {
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

  var self        = this;
  var xmlRoot     = self._xml.get('/ChangeResourceRecordSetsResponse');
  var changeInfo  = _.xmlToJson(xmlRoot.get('./ChangeInfo'));

  self.changeInfo = {
    id: changeInfo.Id,
    status: changeInfo.Status,
    submittedAt: new Date(changeInfo.SubmittedAt),
  };
}

util.inherits(Response, route53.Response);

module.exports.Request  = Request;
module.exports.Response = Response;

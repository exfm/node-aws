var
  util = require('util'),
  libxmljs = require('libxmljs'),
  route53 = require('../route53'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * POST ChangeResourceRecordSets
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  route53.Request.call(this, args, 'POST');

  if (!route53.matchHostedZone(args.id)) {
    throw new aws.Exception('"' + args.id + '" is not a valid id', 'InvalidArgument');
  }

  var self      = this;
  self._path += _.asString(args.id) + '/rrset';
  self._xml     = new libxmljs.Document();
  var xmlRoot   = self._xml.node('ChangeResourceRecordSetsRequest');
  var xmlBatch  = xmlRoot.node('ChangeBatch');

  xmlRoot.namespace(route53.xmlns);

  if (null != args.comment) {
    xmlBatch.node('Comment').text(_.asString(args.comment));
  }

  if (_.isArray(args.changes)) {
    var xmlChanges = xmlBatch.node('Changes');

    for (var i in args.changes) {
      var xmlChange         = xmlChanges.node('Change');
      var change            = args.changes[i];
      var resourceRecordSet = change.resourceRecordSet;

      if (_.isObject(change)) {
        if (null != change.action) {
          xmlChange.node('Action').text(_.asString(change.action));
        }

        if (_.isObject(resourceRecordSet)) {
          var xmlResourceRecordSet = xmlChange.node('ResourceRecordSet');

          if (null != resourceRecordSet.name) {
            xmlResourceRecordSet.node('Name').text(_.asString(resourceRecordSet.name));
          }

          if (null != resourceRecordSet.type) {
            xmlResourceRecordSet.node('Type').text(_.asString(resourceRecordSet.type));
          }

          if (null != resourceRecordSet.ttl) {
            xmlResourceRecordSet.node('TTL').text(_.asString(resourceRecordSet.ttl));
          }

          var resourceRecords = resourceRecordSet.resourceRecords;

          if (_.isArray(resourceRecords)) {
            var xmlResourceRecords = xmlResourceRecordSet.node('ResourceRecords');

            for (var j in resourceRecords) {
              xmlResourceRecords.node('ResourceRecord').node('Value').text(_.asString(resourceRecords[j]));
            }
          }
        }
      }
    }
  }
}

util.inherits(Request, route53.Request);

/**
 * ChangeResourceRecordSetsResponse
 */
var Response = module.exports.Response = function(response) {
  route53.Response.call(this, response);

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
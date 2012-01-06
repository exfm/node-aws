var
  util = require('util'),
  route53 = require('../route53');

/**
 * POST ChangeResourceRecordSets
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method  = 'POST';
  request.path   += args.id + '/rrset';
  var xml         = request.xml('ChangeResourceRecordSetsRequest', route53.xmlns).root();
  var xmlBatch    = xml.node('ChangeBatch');

  if ('undefined' !== typeof args.comment) {
    xmlBatch.node('Comment').text(args.comment);
  }

  if (util.isArray(args.changes)) {
    var xmlChanges = xmlBatch.node('Changes');

    args.changes.forEach(function(change) {
      var xmlChange = xmlChanges.node('Change');

      if (change instanceof Object) {
        if ('undefined' !== typeof change.action) {
          xmlChange.node('Action').text(change.action);
        }

        if (change.resourceRecordSet instanceof Object) {
          var xmlResourceRecordSet = xmlChange.node('ResourceRecordSet');

          if ('undefined' !== typeof change.resourceRecordSet.name) {
            xmlResourceRecordSet.node('Name').text(change.resourceRecordSet.name);
          }

          if ('undefined' !== typeof change.resourceRecordSet.type) {
            xmlResourceRecordSet.node('Type').text(change.resourceRecordSet.type);
          }

          if ('undefined' !== typeof change.resourceRecordSet.ttl) {
            xmlResourceRecordSet.node('TTL').text(change.resourceRecordSet.ttl);
          }

          var resourceRecords = change.resourceRecordSet.resourceRecords;

          if (util.isArray(resourceRecords)) {
            var xmlResourceRecords = xmlResourceRecordSet.node('ResourceRecords');

            resourceRecords.forEach(function(resourceRecord) {
              xmlResourceRecords.node('ResourceRecord').node('Value').text(resourceRecord);
            });
          }
        }
      }
    });
  }
}

/**
 * ChangeResourceRecordSetsResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var xml         = response.xml.get('/ChangeResourceRecordSetsResponse');
  var changeInfo  = response.xmlToJson(xml.get('./ChangeInfo'));

  response.data.changeInfo = {
    id: changeInfo.Id,
    status: changeInfo.Status,
    submittedAt: new Date(changeInfo.SubmittedAt),
  };
}
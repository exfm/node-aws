var
util = require('util'),
cloudFormation = require('../cloudFormation'),
aws = require('../aws'),
_ = require('../util');

/**
 * GET ListStackResources
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  cloudFormation.Request.call(this, args, 'ListStackResources');

  var self  = this;
  var query = self._query;

  if (null != args.nextToken) {
    query['NextToken'] = _.asString(args.nextToken);
  }


  if (!args.stackName) {
    throw new aws.ServiceError(null, '"' + args.stackName + '" is not a valid stackName', 'InvalidArgument');
  } else {
    query['StackName'] = _.asString(args.stackName);
  }
};

util.inherits(Request, cloudFormation.Request);

/**
 * ListResourceRecordSetsResponse
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  cloudFormation.Response.call(this, response);

  var self                  = this;
  var xmlRoot               = self._xml.get('/ListStackResourcesResponse');
  var xmlMembers = xmlRoot.find('./ListStackResourcesResult/StackResourceSummaries/member');
  self.members   = [];
  for (var i in xmlMembers) {
    var xmlMember  = xmlMembers[i];
    var member     = {
        resourceStatus: _.xmlToJson(xmlMember.get('./ResourceStatus')),
        logicalResourceId: _.xmlToJson(xmlMember.get('./LogicalResourceId')),
        physicalResourceId: _.xmlToJson(xmlMember.get('./PhysicalResourceId')),
        lastUpdateTimeStamp: _.xmlToJson(xmlMember.get('./LastUpdateTimeStamp')),
        resourceType: _.xmlToJson(xmlMember.get('./ResourceType')),
    };

    self.members.push(member);
  }
};

util.inherits(Response, cloudFormation.Response);
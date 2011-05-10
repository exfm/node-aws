var
  util = require('util'),
  aws = require('./aws'),
  _ = require('./util');

// Version Information
var version = module.exports.version  = '2011-02-28';
var xmlns   = module.exports.xmlns    = 'http://ec2.amazonaws.com/doc/' + version + '/';
var methods = module.exports.methods  = {
  // Availability Zones and Regions
  'describeAvailabilityZones': true,
  'describeRegions': true,

  // Elastic IP Addresses
  'allocateAddress': true,
  'associateAddress': true,
  'describeAddresses': true,
  'disassociateAddress': true,
  'releaseAddress': true,

  // General
  'getConsoleOutput': true,

  // Instances
  'describeInstances': true,
  'rebootInstances': true,
  'startInstances': true,
  'stopInstances': true,

  // Key Pairs
  'createKeyPair': true,
  'deleteKeyPair': true,
  'describeKeyPairs': true,
  'importKeyPair': true,
}

/**
 * A generic EC2 request.
 *
 * @param   {Object}  args
 * @param   {String}  action
 */
var Request = module.exports.Request = function(args, action) {
  aws.QueryRequest.call(this, args, 'ec2.amazonaws.com', '/', version, action);

  var self                = this;
  var query               = self._query;
  query.SignatureMethod   = 'Hmac' + self.getSignatureAlgorithm().toUpperCase();
  query.SignatureVersion  = 2;
  query.Timestamp         = self._date.toISOString().replace(/\.[0-9]{0,3}Z$/, 'Z');
}

util.inherits(Request, aws.QueryRequest);

/**
 * Returns the string to sign.
 *
 * @param   {String}  accessKeyId
 * @return  {String}
 */
Request.prototype.getStringToSign = function(accessKeyId) {
  var self            = this;
  var query           = self._getQuery();
  var queryNames      = [];
  var sortedQuery     = {};
  query.AWSAccessKeyId = accessKeyId;

  for (var name in query) {
    queryNames.push(name);
  }

  queryNames.sort();

  for (var i in queryNames) {
    var queryName           = queryNames[i];
    sortedQuery[queryName]  = query[queryName];
  }

  var stringToSign  = self._method + "\n"
                    + self._host + "\n"
                    + self._path + "\n"
                    + _.stringifyQuery(sortedQuery);

  return stringToSign;
}

/**
 * Signs the request with the given key and signature.
 *
 * @param   {String}  accessKeyId
 * @param   {String}  secretAccessKey
 * @return  {Request}
 */
Request.prototype.sign = function(accessKeyId, signature) {
  var self              = this;
  var query             = self._query;
  query.AWSAccessKeyId  = _.asString(accessKeyId);
  query.Signature       = _.asString(signature);

  return self;
}

/**
 * A generic EC2 Describe* request.
 *
 * @param   {Object}  args
 * @param   {String}  action
 */
var DescribeRequest = module.exports.DescribeRequest = function(args, action) {
  Request.call(this, args, action);

  var self = this;

  if (_.isArray(args.filters)) {
    for (var i in args.filters) {
      var filter = args.filters[i];

      if (_.isObject(filter)) {
        if (null != filter.name) {
          self._query['Filter.' + i  +'.Name'] = _.asString(filter.name);
        }

        if (_.isArray(filter.values)) {
          for (var j in filter.values) {
            self._query['Filter.' + i  +'.Value.' + j] = _.asString(filter.values[i]);
          }
        }
      }
    }
  }
}

util.inherits(DescribeRequest, Request);

/**
 * A generic EC2 response.
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  aws.Response.call(this, response);

  var self  = this;
  var error = _.xmlToJson(self._xml.get('/Response/Errors/Error'));

  if (error) {
    throw new aws.ResponseException(
      error.Message,
      error.Code,
      _.xmlToJson(self._xml.get('/Response/RequestID'))
    );
  }

  self.requestId = self._xml.root().get('./requestId').text();
}

util.inherits(Response, aws.Response);
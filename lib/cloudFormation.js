var
util = require('util'),
crypto = require('crypto'),
aws = require('./aws'),
_ = require('./util');

// Version Information
var version = module.exports.version  = '2010-05-15';
var xmlns   = module.exports.xmlns    = 'http://cloudformation.amazonaws.com/doc/' + version + '/';
var methods = module.exports.methods  = {
  'listStackResources': true,
}

/**
 * A generic Route53 request.
 *
 * @param   {Object}  args
 * @param   {String}  method
 */
var Request = module.exports.Request = function(args, action) {

  if (!args.region) {
    throw new aws.ServiceError(null, '"' + args.region + '" is not a valid region', 'InvalidArgument');
  }
  aws.QueryRequest.call(this, args, 'cloudformation.' + args.region + '.amazonaws.com', '/', version, action);

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
 * A generic CloudFormation response.
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  aws.Response.call(this, response);

  var self  = this;
  var error = _.xmlToJson(self._xml.get('/ErrorResponse/Error'));

  if (error) {
    throw new aws.ResponseException(
      error.Message,
      error.Code,
      _.xmlToJson(self._xml.get('/Response/RequestID')),
      {
      boxUsage: _.asFloat(error.BoxUsage)
      }
    );
  } else {
    var metadata    = _.xmlToJson(self._xml.root().get('./ResponseMetadata'));
    self.requestId  = metadata.RequestId;
    self.boxUsage   = _.asFloat(metadata.BoxUsage);
  }
}
util.inherits(Response, aws.Response);
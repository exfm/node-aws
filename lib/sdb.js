var
  util = require('util'),
  aws = require('./aws');

// Version Information
var version         = '2009-04-15';
var xmlns           = 'http://sdb.amazonaws.com/doc/' + version + '/';
var defaultEndpoint = 'sdb.amazonaws.com';
var methods         = [
  'batchDeleteAttributes',
  'batchPutAttributes',
  'createDomain',
  'deleteAttributes',
  'deleteDomain',
  'domainMetadata',
  'getAttributes',
  'listDomains',
  'putAttributes',
  'select',
];

/**
 * A generic SimpleDB request.
 */
var Request = function(endpoint) {
  aws.QueryRequest.call(this);

  var self                    = this;
  self.host                   = endpoint || defaultEndpoint;
  self.query.Version          = version;
  self.query.SignatureMethod  = 'Hmac' + self.signatureAlgorithm.toUpperCase();
  self.query.SignatureVersion = 2;
  self.query.Timestamp        = self.date.toISOString().replace(/\.[0-9]{0,3}Z$/, 'Z');
}

util.inherits(Request, aws.QueryRequest);

/**
 * A generic SimpleDB response.
 *
 * @param   {Object}  httpResponse
 */
var Response = function(httpResponse) {
  aws.Response.call(this, httpResponse);

  var self  = this;
  var error = self.xmlToJson(self.xml.get('/Response/Errors/Error'));

  if (error) {
    var data      = {};
    var boxUsage  = parseFloat(error.BoxUsage);

    if (!isNaN(boxUsage)) {
      data.boxUsage = boxUsage;
    }

    throw new aws.ResponseException(
      error.Message,
      error.Code,
      self.xmlToJson(self.xml.get('/Response/RequestID')),
      data
    );
  }

  var metadata        = self.xmlToJson(self.xml.root().get('./ResponseMetadata'));
  self.requestId      = metadata.RequestId;
  self.data.boxUsage  = parseFloat(metadata.BoxUsage);
}

util.inherits(Response, aws.Response);

// Exports
module.exports.version          = version;
module.exports.xmlns            = xmlns;
module.exports.defaultEndpoint  = defaultEndpoint;
module.exports.methods          = methods;
module.exports.methodPath       = __dirname + '/sdb/';
module.exports.Request          = Request;
module.exports.Response         = Response;
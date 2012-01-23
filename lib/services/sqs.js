var
  util = require('util'),
  url = require('url'),
  aws = require('../aws');

// Version Information
var version         = '2011-10-01';
var xmlns           = 'http://sqs.amazonaws.com/doc/' + version + '/';
var defaultEndpoint = 'sqs.us-east-1.amazonaws.com';
var methods         = [
  // Actions for Queues
  'createQueue',
  'deleteQueue',
  'listQueues',
  'getQueueUrl',
  'getQueueAttributes',
  'setQueueAttributes',

  // Actions for Access Control on Queues
  'addPermission',
  'removePermission',

  // Actions for Messages
  'sendMessage',
  'sendMessageBatch',
  'receiveMessage',
  'deleteMessage',
  'deleteMessageBatch',
  'changeMessageVisibility',
  'changeMessageVisibilityBatch',
];

/**
 * A generic SQS request.
 *
 * @param   {String}  endpoint
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
 * Parses the given arguments, adding the queue URL to the request.
 *
 * @param   {Object}  args
 */
Request.prototype.encodeQueueUrl = function(args) {
  if ('undefined' !== typeof args.queueUrl) {
    var queryUrl = url.parse(args.queueUrl);

    if (queryUrl.host) {
      this.host = queryUrl.host;
    }

    this.path = queryUrl.pathname;
  }
};

/**
 * A generic SNS response.
 *
 * @param   {Object}  httpResponse
 */
var Response = function(httpResponse) {
  aws.Response.call(this, httpResponse);

  var self  = this;
  var error = self.xmlToJson(self.xml.get('/ErrorResponse/Error'));

  if (error) {
    throw new aws.ResponseException(
      error.Message,
      error.Code,
      self.xmlToJson(self.xml.get('/ErrorResponse/RequestId'))
    );
  }

  self.requestId = self.xmlToJson(self.xml.root().get('./ResponseMetadata/RequestId'));
}

util.inherits(Response, aws.Response);

// Exports
module.exports.version          = version;
module.exports.xmlns            = xmlns;
module.exports.defaultEndpoint  = defaultEndpoint;
module.exports.methods          = methods;
module.exports.methodPath       = __dirname + '/sqs/';
module.exports.Request          = Request;
module.exports.Response         = Response;
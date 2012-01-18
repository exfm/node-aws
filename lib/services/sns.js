var
  util = require('util'),
  aws = require('../aws');

// Version Information
var version         = '2010-03-31';
var xmlns           = 'http://sns.amazonaws.com/doc/' + version + '/';
var defaultEndpoint = 'sns.us-east-1.amazonaws.com';
var methods         = [
  'addPermission',
  'confirmSubscription',
  'createTopic',
  'deleteTopic',
  'getSubscriptionAttributes',
  'getTopicAttributes',
  'listSubscriptions',
  'listSubscriptionsByTopic',
  'listTopics',
  'publish',
  'removePermission',
  'setSubscriptionAttributes',
  'setTopicAttributes',
  'subscribe',
  'unsubscribe',
];

/**
 * A generic SNS request.
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
module.exports.methodPath       = __dirname + '/sns/';
module.exports.Request          = Request;
module.exports.Response         = Response;
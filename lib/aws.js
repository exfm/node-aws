var
  util = require('util'),
  https = require('https'),
  crypto = require('crypto'),
  libxmljs = require('libxmljs'),
  EventEmitter = require('events').EventEmitter,
  _ = require('./util');

/**
 * An AWS client that is capable of handling any AWS request.
 *
 * @param   {Object}  options
 */
var Client = function(options) {
  if (!_.instanceOf(options, Object)) {
    throw new Error('options must be an object');
  }

  if (!_.isString(options.accessKeyId)) {
    throw new Error('options.accessKeyId must be a string');
  }

  if (!_.isString(options.secretAccessKey)) {
    throw new Error('options.secretAccessKey must be a string');
  }

  var self              = this;
  self._accessKeyId     = options.accessKeyId;
  self._secretAccessKey = options.secretAccessKey;

  EventEmitter.call(self);
}

util.inherits(Client, EventEmitter);

/**
 * Makes an AWS HTTPS request and invokes the optional callback with the response.
 *
 * @param   {Request}   request
 * @param   {Function}  callback
 * @return  {Client}
 */
Client.prototype.request = function(serviceName, methodName, args, callback) {
  var self = this;
  var service, method;

  if (!_.isString(serviceName)) {
    callback(new Exception('serviceName must be a string', 'InvalidArgument'));

    return self;
  }

  try {
    service = require('./' + serviceName);
  } catch (e) {
    callback(new Exception(serviceName + ' is not a valid AWS service', 'InvalidArgument'));

    return self;
  }

  if (!_.isString(methodName)) {
    callback(new Exception('methodName must be a string', 'InvalidArgument'));

    return self;
  }

  try {
    method = require('./' + serviceName + '/' + methodName);
  } catch (e) {
    callback(new Exception(methodName + ' is not a valid ' + serviceName + ' method', 'InvalidArgument'));

    return self;
  }

  if (!_.isObject(args)) {
    callback(new Exception('args must be an Object', 'InvalidArgument'));

    return self;
  }

  if (!_.instanceOf(callback, Function)) {
    callback(new Exception('callback must be a Function', 'InvalidArgument'));

    return self;
  }

  var request;

  try {
    request = new method.Request(args);
  } catch (e) {
    callback(e);

    return self;
  }

  var signature = request.getStringToSign(self._accessKeyId);
  var hmac      = crypto.createHmac(request.getSignatureAlgorithm(), self._secretAccessKey);
  signature     = hmac.update(signature).digest(request.getSignatureDigest());

  request.sign(self._accessKeyId, signature);

  https.request(request.getOptions(), function(httpResponse) {
    httpResponse.data = '';

    httpResponse.on('data', function(chunk) {
      httpResponse.data += chunk;
    });

    httpResponse.on('end', function() {
      var response;

      try {
        response = request.getResponse(httpResponse);
      } catch (e) {
        callback(e);

        return;
      }

      callback(response);
    });
  }).end(request.toString());

  return self;
}

/**
 * A generic AWS request.
 *
 * @param   {Object}    args
 * @param   {Function}  response
 * @param   {String}    host
 * @param   {String}    method
 * @param   {String}    path
 */
var Request = function(response, args, host, method, path) {
  if (null == response || !response instanceof Response) {
    throw new Error('response is a required Response object');
  }

  if (null == args || !args instanceof Object) {
    throw new Error('args is a required object');
  }

  if (!_.isString(host)) {
    throw new Error('host is a required string');
  }

  if (!_.isString(method)) {
    throw new Error('method is a required string');
  }

  if (!_.isString(path)) {
    throw new Error('path is a required string');
  }

  var self        = this;
  self._date      = new Date();
  self._response  = response;
  self._args      = args;
  self._host      = host;
  self._path      = path;
  self._method    = method.toUpperCase();
  self._headers   = {
    'Date': self._date.toUTCString(),
  };
}

/**
 * Returns the string to sign.
 *
 * @param   {String}  accessKeyId
 * @return  {String}
 */
Request.prototype.getStringToSign = function(accessKeyId) {
  return '';
}

/**
 * Returns the signature algorithm.
 *
 * @return  {String}
 */
Request.prototype.getSignatureAlgorithm = function() {
  return 'sha1';
}

/**
 * Returns the signature digest encoding.
 *
 * @return  {String}
 */
Request.prototype.getSignatureDigest = function() {
  return 'base64';
}

/**
 * Signs the request with the given key and signature.
 *
 * @param   {String}  accessKeyId
 * @param   {String}  secretAccessKey
 * @return  {Request}
 */
Request.prototype.sign = function(accessKeyId, signature) {
  if (!_.isString(accessKeyId)) {
    throw new Error('accessKeyId is a required string');
  }

  if (!_.isString(signature)) {
    throw new Error('signature is a required string');
  }

  return this;
}

/**
 * Returns the request options (http/https compatible).
 *
 * @return  {Object}
 */
Request.prototype.getOptions = function() {
  var self    = this;
  var headers = {};

  // Perform a shallow copy to ensure `headers` is not manipulated outside of
  // the Request object.
  for (var name in self._headers) {
    headers[name] = self._headers[name];
  }

  return {
    host: self._host,
    path: self._path,
    method: self._method,
    headers: headers,
  }
}

/**
 * Returns the body of the request.
 *
 * @return  {String}
 */
Request.prototype.getBody = function() {
  return '';
}

/**
 * Returns a new response.
 *
 * @param   {Object}  response
 * @return  {Response}
 */
Request.prototype.getResponse = function(response) {
  return new this._response(response);
}

/**
 * Returns the request as a string.
 *
 * @return  {String}
 */
Request.prototype.toString = function() {
  return this.getBody();
}

/**
 * A generic query-based request.
 *
 * @param   {Function}  response
 * @param   {Object}    args
 * @param   {String}    host
 * @param   {String}    path
 * @param   {String}    version
 * @param   {String}    action
 */
var QueryRequest = function(response, args, host, path, version, action) {
  Request.call(this, response, args, host, 'GET', path);

  if (!_.isString(version)) {
    throw new Error('version is a required string');
  }

  if (!_.isString(action)) {
    throw new Error('action is a required string');
  }

  var self                        = this;
  self._headers['Content-Length'] = 0;
  self._query                     = {
    Action: action,
    Version: version,
    Timestamp: self._date.toISOString().replace(/\.[0-9]{0,3}Z$/, 'Z'),
    SignatureMethod: 'HmacSHA1',
    SignatureVersion: 2,
  };
}

util.inherits(QueryRequest, Request);

/**
 * Returns the string to sign.
 *
 * @param   {String}  accessKeyId
 * @return  {String}
 */
QueryRequest.prototype.getStringToSign = function(accessKeyId) {
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
QueryRequest.prototype.sign = function(accessKeyId, signature) {
  Request.prototype.sign.call(this, accessKeyId, signature);

  var self                    = this;
  self._query.AWSAccessKeyId  = accessKeyId;
  self._query.Signature       = signature;

  return self;
}

/**
 * Returns the request options (http/https compatible).
 *
 * @return  {Object}
 */
QueryRequest.prototype.getOptions = function() {
  var self      = this;
  var options   = Request.prototype.getOptions.call(self);
  options.path += '?' + _.stringifyQuery(self._query);

  return options;
}

/**
 * Gets a copy of the query parameters.
 *
 * @return  {Object}
 */
QueryRequest.prototype._getQuery = function() {
  var self  = this;
  var query = {};

  for (var name in self._query) {
    query[name] = self._query[name];
  }

  return query;
}

/**
 * A generic REST-based request.
 *
 * @param   {Function}  response
 * @param   {Object}    args
 * @param   {String}    host
 * @param   {String}    method
 * @param   {String}    path
 */
var RestRequest = function(response, args, host, method, path) {
  Request.call(this, response, args, host, method, path);

  var self                      = this;
  self._xml                     = null;
  self._headers['Content-Type'] = 'text/xml; charset=utf-8';
}

util.inherits(RestRequest, Request);

/**
 * Returns the request options (http/https compatible).
 *
 * @return  {Object}
 */
RestRequest.prototype.getOptions = function() {
  var self    = this;
  var length  = self.getBody().length;
  var options = Request.prototype.getOptions.call(self);

  options.headers['Content-Length'] = length;

  return options;
}

/**
 * Returns the request body.
 *
 * @return  {String}
 */
RestRequest.prototype.getBody = function() {
  if (null == this._xml) {
    return '';
  }

  return this._xml.toString();
}

/**
 * Returns the XML-representation of the request.
 *
 * @return  {Object}
 */
RestRequest.prototype.toXml = function() {
  return this._xml;
}

/**
 * A generic AWS response object.
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = function(response) {
  var self        = this;
  var contentType = response.headers['content-type'];
  self._xml       = null;
  self.requestId  = null;

  if (0 < response.data.length && (null == contentType || 0 == contentType.indexOf('text/xml'))) {
    self._xml = libxmljs.parseXmlString(
      response.data.replace(/ ?xmlns="(.*?)"/, '')
    );
  }
}

/**
 * A generic exception.
 *
 * @param   {String}  message
 * @param   {String}  code
 */
var Exception = function(message, code) {
  Error.call(this, message);

  var self      = this;
  self.message  = message;
  self.code     = code;
}

util.inherits(Exception, Error);

/**
 * A generic service error.
 *
 * @param   {String}  message
 * @param   {String}  code
 * @param   {String}  requestId
 * @param   {Object}  args
 */
var ResponseException = function(message, code, requestId, args) {
  Exception.call(this, message, code);

  var self        = this;
  self.requestId  = requestId;

  if (_.isObject(args)) {
    for (var name in args) {
      self[name] = args[name];
    }
  }
}

util.inherits(ResponseException, Exception);

/**
 * Returns a new AWS client.
 *
 * @return  {Client}
 */
var createClient = function(options) {
  return new Client(options);
}

module.exports.Client             = Client;
module.exports.Request            = Request;
module.exports.QueryRequest       = QueryRequest;
module.exports.RestRequest        = RestRequest;
module.exports.Response           = Response;
module.exports.Exception          = Exception;
module.exports.ResponseException  = ResponseException;
module.exports.createClient       = createClient;
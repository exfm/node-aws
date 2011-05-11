var
  util = require('util'),
  https = require('https'),
  crypto = require('crypto'),
  libxmljs = require('libxmljs'),
  EventEmitter = require('events').EventEmitter,
  _ = require('./util');

// Map of supported AWS services
var services = module.exports.services = {
  'ec2': true,
  'route53': true,
  's3': true,
  'ses': true,
  'simpleDb': true,
}

/**
 * An AWS client that is capable of handling any AWS request.
 *
 * @param   {Object}  options
 */
var Client = module.exports.Client = function(options) {
  var self = this;

  if (!_.isObject(options)) {
    throw new Error('options must be an object');
  }

  self._accessKeyId     = _.asString(options.accessKeyId);
  self._secretAccessKey = _.asString(options.secretAccessKey);

  EventEmitter.call(self);
}

util.inherits(Client, EventEmitter);

/**
 * Makes an AWS HTTPS request and invokes the callback with the response.
 *
 * @param   {String}    serviceName
 * @param   {String}    methodName
 * @param   {Object}    args
 * @param   {Function}  callback
 * @return  {Client}
 */
Client.prototype.request = function(serviceName, methodName, args, callback) {
  var self          = this;
  serviceName       = _.asString(serviceName);
  methodName        = _.asString(methodName);

  if (!services[serviceName]) {
    throw new Error('"' + serviceName + '" is not a supported AWS service');
  }

  var service = require('./' + serviceName);

  if (!service.methods[methodName]) {
    throw new Exception('"' + methodName + '" is not a valid "' + serviceName + '" method');
  }

  var method = require('./' + serviceName + '/' + methodName);

  if (!_.isObject(args)) {
    throw new Error('args must be an Object');
  }

  if (!_.instanceOf(callback, Function)) {
    throw new Error('callback must be a Function');
  }

  try {
    var request   = new method.Request(args);
    var signature = request.getStringToSign(self._accessKeyId);
    var hmac      = crypto.createHmac(request.getSignatureAlgorithm(), self._secretAccessKey);
    signature     = hmac.update(signature).digest(request.getSignatureDigest());

    request.sign(self._accessKeyId, signature);

    self.emit('request', serviceName, methodName, request);

    https.request(request.getOptions(), function(httpResponse) {
      httpResponse.data = '';

      httpResponse.on('data', function(chunk) {
        httpResponse.data += chunk;
      });

      httpResponse.on('end', function() {
        var response;

        try {
          response = new method.Response(httpResponse);
        } catch (e) {
          callback(e);
        }

        if (response) {
          self.emit('response', serviceName, methodName, response);
          callback(response);
        }
      });
    }).end(request.getBody());
  } catch (e) {
    callback(e);
  }

  return self;
}

/**
 * A generic AWS request.
 *
 * @param   {Object}    args
 * @param   {String}    host
 * @param   {String}    method
 * @param   {String}    path
 */
var Request = module.exports.Request = function(args, host, method, path) {
  if (!_.isObject(args)) {
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

  var self      = this;
  self._date    = new Date();
  self._args    = args;
  self._host    = host;
  self._path    = path;
  self._method  = method.toUpperCase();
  self._headers = {
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
  
  headers['Content-Length'] = self.getBody().length;

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
 * Returns the request as a string.
 *
 * @return  {String}
 */
Request.prototype.toString = function() {
  var self    = this;
  var options = self.getOptions();
  var string  = options.method + ' ' + options.path + "\n"
              + "Host: " + options.host + "\n";

  for (var name in options.headers) {
    string += name + ": " + options.headers[name] + "\n";
  }

  return string + "\n" + self.getBody();
}

/**
 * A generic query-based request.
 *
 * @param   {Object}  args
 * @param   {String}  host
 * @param   {String}  path
 * @param   {String}  version
 * @param   {String}  action
 */
var QueryRequest = module.exports.QueryRequest = function(args, host, path, version, action) {
  Request.call(this, args, host, 'POST', path);

  if (!_.isString(version)) {
    throw new Error('version is a required string');
  }

  if (!_.isString(action)) {
    throw new Error('action is a required string');
  }

  var self                      = this;
  self._headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
  self._query                   = {
    Action: action,
    Version: version,
  };
}

util.inherits(QueryRequest, Request);

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
 * Returns the body of the request.
 *
 * @return  {String}
 */
QueryRequest.prototype.getBody = function() {
  return _.stringifyQuery(this._query);
}

/**
 * A generic REST-based request.
 *
 * @param   {Object}  args
 * @param   {String}  host
 * @param   {String}  method
 * @param   {String}  path
 */
var RestRequest = module.exports.RestRequest = function(args, host, method, path) {
  Request.call(this, args, host, method, path);

  var self  = this;
  self._xml = null;
}

util.inherits(RestRequest, Request);

/**
 * Returns the request options (http/https compatible).
 *
 * @return  {Object}
 */
RestRequest.prototype.getOptions = function() {
  var self    = this;
  var options = Request.prototype.getOptions.call(self);

  if (self._xml && !_.isString(options.headers['Content-Type'])) {
    self._headers['Content-Type'] = 'text/xml; charset=utf-8';
  }

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
var Response = module.exports.Response = function(response) {
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
var Exception = module.exports.Exception = function(message, code) {
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
var ResponseException = module.exports.ResponseException = function(message, code, requestId, args) {
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
var createClient = module.exports.createClient = function(options) {
  return new Client(options);
}

/**
 * Returns the list of supported AWS methods, grouped by service.
 *
 * @return  {Object}
 */
var getSupportedMethods = module.exports.getSupportedMethods = function() {
  var methods = {};

  for (var serviceName in services) {
    methods[serviceName]  = [];
    service               = require('./' + serviceName);

    for (var method in service.methods) {
      methods[serviceName].push(method);
    }
  }

  return methods;
}

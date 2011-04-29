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
  self._algorithm       = ('sha1' == options.algorithm) ? 'sha1' : 'sha256';

  EventEmitter.call(self);
}

util.inherits(Client, EventEmitter);

/**
 * Signs the request for a given date (defaulting to now).
 *
 * @param   {Request}     request
 * @param   {Date|null}   date
 */
Client.prototype.sign = function(request, date) {
  if (null == request || !request instanceof Request) {
    throw new Error('request is a required Request object');
  }

  if (null == date) {
    date = new Date();
  } else if (!date instanceof Date) {
    throw new Error('date must be a Date object');
  }

  var self = this;

  request.sign(
    self._accessKeyId,
    self._secretAccessKey,
    self._algorithm,
    date
  );

  return self;
}

/**
 * Makes an AWS HTTPS request and invokes the optional callback with the response.
 *
 * @param   {Request}   request
 * @param   {Function}  callback
 * @return  {Client}
 */
Client.prototype.request = function(request, callback) {
  var self = this;

  if (!_.instanceOf(request, Request)) {
    throw new Error('request must be a Request');
  }

  if (!_.instanceOf(callback, Function)) {
    throw new Error('callback must be a Function');
  }

  if (!request.isSigned()) {
    self.sign(request);
  }

  https.request(request.getOptions(), function(response) {
    if (callback) {
      var data = '';

      response.on('data', function(chunk) {
        data += chunk;
      });

      response.on('end', function() {
        try {
          callback(request.getResponse(response.headers, data));
        } catch (e) {
          if (0 == request.listeners('error')) {
            self.emit('error', e);
          } else {
            request.emit('error', e);
          }
        }
      });
    }
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
  EventEmitter.call(this);

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
  self._response  = response;
  self._args      = args;
  self._host      = host;
  self._path      = path;
  self._method    = method.toUpperCase();
  self._headers   = {};

  // Signature properties
  self._isSigned        = false;
  self._accessKeyId     = null;
  self._secretAccessKey = null;
  self._date            = null;
  self._algorithm       = null;
}

util.inherits(Request, EventEmitter);

/**
 * Signs the request with the given keys, algorithm, and date.
 *
 * @param   {String}  accessKeyId
 * @param   {String}  secretAccessKey
 * @param   {String}  algorithm
 * @param   {Date}    date
 * @return  {Request}
 */
Request.prototype.sign = function(accessKeyId, secretAccessKey, algorithm, date) {
  if (!_.isString(accessKeyId)) {
    throw new Error('accessKeyId is a required string');
  }

  if (!_.isString(secretAccessKey)) {
    throw new Error('secretAccessKey is a required string');
  }

  if ('sha256' != algorithm && 'sha1' != algorithm) {
    throw new Error('algorithm must be "sha256" or "sha1"');
  }

  if (null == date || !date instanceof Date) {
    throw new Error('date is a required Date object');
  }

  var self              = this;
  self._accessKeyId     = accessKeyId;
  self._secretAccessKey = secretAccessKey;
  self._date            = date;
  self._algorithm       = algorithm;
  self._isSigned        = true;

  return self;
}

/**
 * Checks if the request is signed.
 *
 * @return  {Boolean}
 */
Request.prototype.isSigned = function() {
  return this._isSigned;
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
 * @param   {Object}  headers
 * @param   {String}  data
 * @return  {Response}
 */
Request.prototype.getResponse = function(headers, data) {
  return new this._response(headers, data);
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
  };
}

util.inherits(QueryRequest, Request);

/**
 * Returns the request options (http/https compatible).
 *
 * @return  {Object}
 */
QueryRequest.prototype.getOptions = function() {
  var self        = this;
  var options     = Request.prototype.getOptions.call(self);
  var query       = self._getQuery();
  var queryNames  = [];
  var sortedQuery = {};

  if (self.isSigned()) {
    query.AWSAccessKeyId    = self._accessKeyId;
    query.Timestamp         = self._date.toISOString().replace(/\.[0-9]{0,3}Z$/, 'Z');
    query.SignatureMethod   = 'Hmac' + self._algorithm.toUpperCase();
    query.SignatureVersion  = 2;
  }

  for (var name in query) {
    queryNames.push(name);
  }

  queryNames.sort();

  for (var i in queryNames) {
    var queryName           = queryNames[i];
    sortedQuery[queryName]  = query[queryName];
  }

  query = sortedQuery;

  if (self.isSigned()) {
    var hmac        = crypto.createHmac(self._algorithm, self._secretAccessKey);
    var signature   = options.method + "\n"
                    + options.host + "\n"
                    + options.path + "\n"
                    + _.stringifyQuery(query);
    query.Signature = hmac.update(signature).digest('base64');
  }

  options.path           += '?' + _.stringifyQuery(query);
  options.headers['Date'] = (new Date()).toUTCString();

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

  this._xml = null;
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

  if (0 < length) {
    options.headers['Content-Length'] = length;
    options.headers['Content-Type']   = 'text/xml; charset=utf-8';
  }

  if (self.isSigned()) {
    var date    = (new Date()).toUTCString();
    var hmac    = crypto.createHmac(self._algorithm, self._secretAccessKey);
    var auth    = 'AWS3-HTTPS AWSAccessKeyId=' + self._accessKeyId
                + ',Algorithm=Hmac' + self._algorithm.toUpperCase()
                + ',Signature=' + hmac.update(date).digest('base64');

    options.headers['Date']                 = date;
    options.headers['X-Amzn-Authorization'] = auth;
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
var Response = function(headers, data) {
  var self        = this;
  self._headers   = headers;
  self._data      = data;
  self._xml       = null;
  self.requestId  = null;

  if (0 < data.length) {
    self._xml = libxmljs.parseXmlString(
      data.replace(/ ?xmlns="(.*?)"/, '')
    );
  }
}

/**
 * A generic AWS query-based response object.
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var QueryResponse = function(headers, data) {
  Response.call(this, headers, data);
}

util.inherits(QueryResponse, Response);

/**
 * A generic REST-based response.
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var RestResponse = function(headers, data) {
  Response.call(this, headers, data);
}

util.inherits(RestResponse, Response);

/**
 * A generic response error.
 *
 * @param   {String}  message
 * @param   {String}  code
 */
var ResponseError = function(message, code) {
  Error.call(message);

  this.message  = message;
  this.code     = code;
}

util.inherits(ResponseError, Error);

module.exports.Client         = Client;
module.exports.Request        = Request;
module.exports.QueryRequest   = QueryRequest;
module.exports.QueryResponse  = QueryResponse;
module.exports.Response       = Response;
module.exports.RestRequest    = RestRequest;
module.exports.RestResponse   = RestResponse;
module.exports.ResponseError  = ResponseError;

/**
 * Returns a new AWS client.
 *
 * @return  {Client}
 */
module.exports.createClient = function(options) {
  return new Client(options);
}

/**
 * Returns the requested service.
 *
 * @return  {Module}
 */
module.exports.getService = function(service) {
  if (!_.isString(service)) {
    throw new Error('service must be a string');
  }

  //try {
    return require('./services/' + service);
  //} catch (e) {
//    throw new Error(service + ' is not a valid service');
//  }
}
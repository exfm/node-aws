var
  util = require('util'),
  https = require('https'),
  crypto = require('crypto'),
  libxmljs = require('libxmljs'),
  querystring = require('querystring'),
  EventEmitter = require('events').EventEmitter;

/**
 * An AWS client that is capable of handling any AWS request.
 *
 * @param   {Object}  options
 */
var Client = function(options) {
  if (!options instanceof Object) {
    throw new Error('options must be an object');
  }

  if (!isString(options.accessKeyId)) {
    throw new Error('options.accessKeyId must be a string');
  }

  if (!isString(options.secretAccessKey)) {
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
  if (!request instanceof Request) {
    throw new Error('request must be a Request object');
  }

  if (null == date) {
    date = new Date();
  } else if (!date instanceof Date) {
    throw new Error('date must be null or a Date object');
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

  if (!request instanceof Request) {
    throw new Error('request must be a Request object');
  }

  if (null != callback && !callback instanceof Function) {
    throw new Error('callback must be a Function object');
  }

  https.request(request.getOptions(), function(response) {
    if (callback) {
      var data = '';

      response.on('data', function(chunk) {
        data += chunk;
      });

      response.on('end', function() {
        callback(request.getResponse(response.headers, data));
      });
    }
  }).end(request.toString());

  return self;
}

/**
 * A generic AWS request.
 *
 * @param   {Function}  response
 * @param   {String}    host
 * @param   {String}    method
 * @param   {String}    path
 * @param   {Object}    headers
 */
var Request = function(response, host, method, path, headers) {
  if (!response instanceof Response) {
    throw new Error('response must be a Response object');
  }

  if (!isString(host)) {
    throw new Error('host must be a string');
  }

  if (!isString(method)) {
    throw new Error('method must be a string');
  }

  if (!isString(path)) {
    throw new Error('path must be a string');
  }

  if (!headers instanceof Object) {
    throw new Error('headers must be an Object');
  }

  var self        = this;
  self._response  = response;
  self._host      = host;
  self._path      = path;
  self._method    = method.toUpperCase();
  self._headers   = headers;

  // Signature properties
  self._isSigned        = false;
  self._accessKeyId     = null;
  self._secretAccessKey = null;
  self._date            = null;
  self._algorithm       = null;
}

/**
 * Signs the request with the given keys, algorithm, and date.
 *
 * @param   {String}  accessKeyid,
 * @param   {String}  secretAccessKey
 * @param   {String}  algorithm
 * @param   {Date}    date
 * @return  {Request}
 */
Request.prototype.sign = function(accessKeyId, secretAccessKey, algorithm, date) {
  if (!isString(accessKeyId)) {
    throw new Error('accessKeyId must be a string');
  }

  if (!isString(secretAccessKey)) {
    throw new Error('secretAccessKey must be a string');
  }

  if ('sha256' != algorithm && 'sha1' != algorithm) {
    throw new Error('algorithm must be "sha256" or "sha1"');
  }

  if (!date instanceof Date) {
    throw new Error('date must be a Date object');
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

  for (var name in self._headers) {
    headers[name] = self._headers;
  }

  return {
    host: self._host,
    path: self._path,
    method: self._method,
    headers: headers,
  }
}

/**
 * Returns a new response.
 *
 * @param   {Object}  headers
 * @param   {String}  data
 * @return  {Response}
 */
Request.prototype.getResponse = function(headers, data) {
  return this._response(headers, data);
}

/**
 * Returns the request data as a string.
 *
 * @return  {String}
 */
Request.prototype.toString = function() {
  return '';
}

/**
 * A generic query-based request.
 *
 * @param   {Function}  response
 * @param   {String}    host
 * @param   {String}    path
 * @param   {String}    version
 * @param   {String}    action
 */
var QueryRequest = function(response, host, path, version, action) {
  Request.call(this, response, host, 'GET', path, {
    'Content-Length': 0,
  });

  if (!isString(version)) {
    throw new Error('version must be a string');
  }

  if (!isString(action)) {
    throw new Error('action must be a string');
  }

  var self    = this;
  self._query = {
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
QueryRequest.prototype.getQuery = function() {
  var self  = this;
  var query = {};

  for (var name in self._query) {
    query[name] = self._query[name];
  }

  return query;
}

/**
 * Returns the request options (http/https compatible).
 *
 * @return  {Object}
 */
QueryRequest.prototype.getOptions = function() {
  var self        = this;
  var options     = Request.prototype.getOptions.call(self);
  var query       = self.getQuery();
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
                    + querystring.stringify(query);
    query.Signature = hmac.update(signature).digest('base64');
  }

  options.path         += '?' + querystring.stringify(query);
  options.headers.Date  = (new Date()).toUTCString();

  return options;
}

/**
 * A generic REST-based request.
 *
 * @param   {Function}  response
 * @param   {String}    host
 * @param   {String}    method
 * @param   {String}    path
 */
var RESTRequest = function(response, host, method, path) {
  Request.call(this, response, host, method, path, {
    'Content-Type': 'text/xml; charset=utf-8',
  });
}

util.inherits(RESTRequest, Request);

/**
 * Returns the request options (http/https compatible).
 *
 * @return  {Object}
 */
RESTRequest.prototype.getOptions = function() {
  var self    = this;
  var options = Request.prototype.getOptions.call(self);

  if (self.isSigned()) {
    var date    = (new Date()).toUTCString();
    var hmac    = crypto.createHmac(self._algorithm, self._secretAccessKey);
    var auth    = 'AWS3-HTTPS AWSAccessKeyId=' + self._accessKeyId
                + ',Algorithm=Hmac' + self._algorithm.toUpperCase()
                + ',Signature=' + hmac.update(date).digest('base64');

    options.headers['Date']                 = date;
    options.headers['X-Amzn-Authorization'] = auth;
  }

  options.headers['Content-Length'] = self.toString().length;

  return options;
}

/**
 * Returns the XML-representation of the request.
 *
 * @return  {Object}
 */
RESTRequest.prototype.toXML = function() {
  return new libxmljs.Document();
}

/**
 * Returns the request XML as a string.
 *
 * @return  {String}
 */
RESTRequest.prototype.toString = function() {
  var xml = this.toXML();

  if (null == xml) {
    return '';
  }

  return xml.toString();
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
  self._requestId = null;
}

/**
 * Returns the unique request ID.
 *
 * @return  {String}
 */
Response.prototype.getRequestId = function() {
  return this._requestId;
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
var RESTResponse = function(headers, data) {
  Response.call(this, headers, data);

  var self  = this;
  data      = data.replace(/ ?xmlns="(.*?)"/, '');
  self._xml = libxmljs.parseXmlString(data);
}

util.inherits(RESTResponse, Response);

/**
 * Converts an XML element into JSON. Ignores attributes and does not support
 * elements with the same name.
 *
 * @param   {Object}  xml
 * @return  {Object}
 */
var xmlToJSON = function(xml) {
  var json      = {};
  var children  = xml.childNodes();

  if (1 == children.length && 'text' == children[0].type()) {
    json = children[0].text();
  } else {
    for (var i in children) {
      var child = children[i];

      if ('element' != child.type()) {
        continue;
      }

      var name = child.name();

      json[name] = xmlToJSON(child);
    }
  }

  return json;
}

/**
 * Checks if the given variable is a string or String object.
 *
 * @param   {Object|string}   string
 * @return  {Boolean}
 */
var isString = function(string) {
  return string instanceof String || typeof string == 'string';
}

module.exports.Client         = Client;
module.exports.Request        = Request;
module.exports.QueryRequest   = QueryRequest;
module.exports.QueryResponse  = QueryResponse;
module.exports.Response       = Response;
module.exports.RESTRequest    = RESTRequest;
modlue.exports.RESTResponse   = RESTResponse;
module.exports.xmlToJSON      = xmlToJSON;
module.exports.isString       = isString;
module.exports.createClient   = function(options) {
  return new Client(options);
}

module.exports.ec2 = require('./ec2');
var
  util = require('util'),
  https = require('https'),
  crypto = require('crypto'),
  libxmljs = require('libxmljs'),
  EventEmitter = require('events').EventEmitter;

/**
 * An abstract AWS client to be extended by all other AWS service clients.
 *
 * @param   {Object}  options
 */
var Client = function(options) {
  if (typeof options == 'undefined') {
    throw new Error('options must be an object');
  }

  if (typeof options.accessKeyId != 'string') {
    throw new Error('options.accessKeyId must be a string');
  }

  if (typeof options.secretAccessKey != 'string') {
    throw new Error('options.secretAccessKeyId must be a string');
  }

  this._accessKeyId     = options.accessKeyId;
  this._secretAccessKey = options.secretAccessKey;
  this._algorithm       = 'sha256';
  this._host;
  this._basePath;

  EventEmitter.call(this);
}

util.inherits(Client, EventEmitter);

/**
 * Returns a request options object.
 *
 * @param   {Object}  options
 */
Client.prototype._getRequestOptions = function(options) {
  var self = this;

  options.host  = self._host;
  options.path  = self._basePath + options.path;

  return options;
}

/**
 * Makes an HTTPS request with the appropriate HTTP headers (including authentication).
 *
 * @param   {Object}    options
 * @param   {Function}  callback
 * @param   {String}    data
 */
Client.prototype.request = function(options, callback, data) {
  if (!options instanceof Object) {
    throw new Error('options must be an object');
  }

  if (!options.host instanceof String) {
    throw new Error('options.host must be a string');
  }

  if (!options.path instanceof String) {
    throw new Error('options.path must be a string');
  }

  if (!options.method instanceof String) {
    throw new Error('options.method must be a string');
  }

  if (null == options.headers) {
    options.headers = {};
  } else if (!options.headers instanceof Object) {
    throw new Error('options.headers must be an object');
  }

  var self  = this;
  var date  = (new Date()).toUTCString();
  var hmac  = crypto.createHmac(self._algorithm, self._secretAccessKey);
  var auth  = 'AWS3-HTTPS AWSAccessKeyId=' + self._accessKeyId
            + ',Algorithm=Hmac' + self._algorithm.toUpperCase()
            + ',Signature=' + hmac.update(date).digest('base64');
  options.headers['Content-Length']       = (null == data) ? 0 : data.length;
  options.headers['Content-Type']         = 'text/xml; charset=utf-8';
  options.headers['Date']                 = date;
  options.headers['X-Amzn-Authorization'] = auth;

  var request = https.request(options, function(response) {
    var responseData = '';

    response.on('data', function(chunk) {
      responseData += chunk;
    });

    response.on('end', function() {
      responseData  = responseData.replace(/ ?xmlns="(.*?)"/, '');
      var xml       = libxmljs.parseXmlString(responseData);

      if ('ErrorResponse' == xml.root().name()) {
        self.emit('error', xmlToJSON(root.get('Error')));
      } else if (-1 != xml.root().name().indexOf('Exception')) {
        self.emit('error', xmlToJSON(xml.root()));
      } else {
        callback(xml);
      }
    });
  });

  request.end(data);
}

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

      if (name.toUpperCase() == name) {
        name = name.toLowerCase();
      } else {
        name = name.substr(0, 1).toLowerCase() + name.substr(1)
      }

      json[name] = xmlToJSON(child);
    }
  }

  return json;
}

module.exports.Client       = Client;
module.exports.xmlToJSON    = xmlToJSON;
module.exports.createClient = function(options) {
  return new Client(options);
}
var
  https = require('https'),
  querystring = require('querystring'),
  crypto = require('crypto'),
  libxmljs = require('libxmljs'),
  util = require('util'),
  promise = require('./promise');

// AWS services supported by node-aws
var services = [
  //'autoScaling',
  //'cloudFormation',
  //'cloudFront',
  //'cloudWatch',
  'ec2',
  //'elastiCache',
  //'elasticCeanstalk',
  //'elasticLoadBalancing',
  //'elasticMapReduce',
  //'iam',
  //'rds',
  'route53',
  'sdb',
  'ses',
  's3',
  //'sns',
  //'sqs',
  //'sts',
];

/**
 * A credentials object that provides encryption functionality.
 *
 * @param   {String}  accessKeyId
 * @param   {String}  secretAccessKey
 */
var Credentials = function(accessKeyId, secretAccessKey) {
  var self = this;

  self.__defineGetter__('accessKeyId', function() {
    return accessKeyId;
  });

  /**
   * Encrypts a string using the secretAccessKey, according to the given algorithm,
   * and returns a digest.
   *
   * @param   {String}  stringToEncrypt
   * @param   {String}  algorithm
   * @param   {String}  digestEncoding
   * @returns {String}
   */
  self.encrypt = function(stringToEncrypt, algorithm, digestEncoding) {
    var hmac = crypto.createHmac(algorithm, secretAccessKey);

    return hmac.update(stringToEncrypt).digest(digestEncoding);
  };
};

/**
 * Represents an AWS service.
 *
 * @param   {Object}  serviceModule
 */
var Service = function(serviceModule) {
  var self    = this;
  var methods = {};

  self.__defineGetter__('version', function() {
    return serviceModule.version;
  });

  self.__defineGetter__('xmlns', function() {
    return serviceModule.xmlns;
  });

  self.__defineGetter__('methods', function() {
    return serviceModule.methods;
  });

  /**
   * Returns the method module.
   *
   * @param   {String}  method
   * @returns {Object}
   */
  self.getMethod = function(method) {
    if ('undefined' === typeof methods[method]) {
      throw new Error('Unknown method: ' + method);
    } else if (!methods[method]) {
      methods[method] = require(serviceModule.methodPath + method);
    }

    return methods[method];
  };

  /**
   * Creates a service-specific Request object, and encodes
   * the request with the given arguments for the specific method.
   *
   * @param   {String}  method
   * @param   {Object}  args
   * @param   {String}  endpoint
   * @returns {Request}
   */
  self.createRequest = function(method, args, endpoint) {
    var request = new serviceModule.Request(endpoint);

    self.getMethod(method).encodeRequest(request, args);

    return request;
  };

  /**
   * Creates a service-specific Response object and decodes
   * the response with the given HTTP response.
   *
   * @param   {String}  method
   * @param   {Object}  httpResponse
   * @returns {Response}
   */
  self.createResponse = function(method, httpResponse) {
    var response = new serviceModule.Response(httpResponse);

    self.getMethod(method).decodeResponse(response);

    return response;
  };

  /**
   * Makes a service request, returning a promise.
   *
   * @param   {String}      method
   * @param   {Object}      args
   * @param   {Credentials} credentials
   * @param   {String}      endpoint
   * @returns {Promise}
   */
  self.request = function(method, args, credentials, endpoint) {
    var self            = this;
    var resultPromise   = promise.create();
    var result          = {
      method: method,
      requestId: null,
    };

    try {
      var request   = self.createRequest(method, args, endpoint);
      var signature = credentials.encrypt(
        request.getStringToSign(credentials.accessKeyId),
        request.signatureAlgorithm,
        request.signatureDigest
      );

      request.sign(credentials.accessKeyId, signature);

      var httpRequest = https.request(request.getOptions(), function(httpResponse) {
        httpResponse.body = '';

        httpResponse.on('data', function(chunk) {
          httpResponse.body += chunk;

          resultPromise.progress({});
        });

        httpResponse.on('end', function() {
          var response;

          try {
            response = self.createResponse(method, httpResponse);
          } catch (e) {
            if (e instanceof ResponseException) {
              result.requestId = e.requestId;

              if (e.data) {
                result.data = e.data;
              }

              delete e.requestId;
              delete e.data;
            }

            result.error = e;

            return resultPromise.fail(result);
          }

          result.requestId  = response.requestId;
          result.data       = response.data;

          return resultPromise.succeed(result);
        });
      });

      httpRequest.on('error', function(e) {
        result.error = e;

        resultPromise.fail(result);
      });

      httpRequest.end(request.getBody());
    } catch (e) {
      result.error = e;

      resultPromise.fail(result);
    }

    return resultPromise;
  };

  self.methods.forEach(function(method) {
    methods[method] = null;
  });
};

/**
 * An AWS services client.
 *
 * @param   {Credentials} credentials
 * @param   {Object}      endpoints
 */
var Client = function(credentials, endpoints) {
  var self = this;

  if ('undefined' === typeof endpoints) {
    endpoints = {};
  }

  self.__defineGetter__('credentials', function() {
    return credentials;
  });

  self.__defineGetter__('endpoints', function() {
    return endpoints;
  });

  var serviceMethods = {};

  services.forEach(function(serviceName) {
    self.__defineGetter__(serviceName, function() {
      if (!serviceMethods[serviceName]) {
        serviceMethods[serviceName] = {};
        var service                 = new Service(require('./services/' + serviceName));

        service.methods.forEach(function(method) {
          serviceMethods[serviceName][method] = function(args, endpoint) {
            return service.request(method, args, credentials, endpoint || self.endpoints[serviceName]);
          };
        });
      }

      return serviceMethods[serviceName];
    });
  });
};

/**
 * A generic AWS request.
 */
var Request = function() {
  var self                = this;
  self.date               = new Date();
  self.method             = '';
  self.host               = '';
  self.path               = '/';
  self.query              = {};
  self.signatureAlgorithm = 'sha1';
  self.signatureDigest    = 'base64';
  self.headers            = {
    'Date': self.date.toUTCString(),
  };
};

/**
 * Signs the request with the given key and signature.
 *
 * @param   {String}  accessKeyId
 * @param   {String}  signature
 * @return  {Request}
 */
Request.prototype.sign = function(accessKeyId, signature) {
  return this;
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
 * Returns the request options (http/https compatible).
 *
 * @return  {Object}
 */
Request.prototype.getOptions = function() {
  var self    = this;
  var headers = {};

  // Perform a shallow copy to ensure `headers` is not manipulated outside of
  // the Request object.
  for (var name in self.headers) {
    headers[name] = self.headers[name];
  }

  headers['Content-Length'] = self.getBody().length;

  return {
    host: self.host,
    path: self.path,
    method: self.method,
    headers: headers,
  };
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
 * Serialize an object to a query string using AWS-specific rules.
 *
 * @param   {Object}  query
 * @return  {String}
 */
Request.prototype.stringifyQuery = function(query) {
  var self            = this;
  var oldEscape       = querystring.escape;
  querystring.escape  = self.escape;
  var stringified     = querystring.stringify(query);
  querystring.escape  = oldEscape;

  return stringified;
};

/**
 * Escapes a string using AWS-specific rules.
 *
 * @param   {String}  string
 * @return  {String}
 */
Request.prototype.escape = function(unescapedString) {
  // ensure it's a string
  var unescapedString = unescapedString + '';
  var escapedString   = '';

  for (var i = 0; i < unescapedString.length; i++) {
    var charCode = unescapedString.charCodeAt(i);

    if (0x002D == charCode ||                         // -
        0x002E == charCode ||                         // .
        0x005F == charCode ||                         // _
        0x007E == charCode ||                         // ~
        (0x0030 <= charCode && 0x0039 >= charCode) || // 0-9
        (0x0041 <= charCode && 0x005A >= charCode) || // A-Z
        (0x0061 <= charCode && 0x007A >= charCode)) { // a-z
      escapedString += unescapedString.charAt(i);
    } else {
      var bytes = [];

      // http://en.wikipedia.org/wiki/UTF-8#Description
      if (0x007F >= charCode) {
        bytes.push(charCode);
      } else if (0x07FF >= charCode) {
        bytes.push((charCode >> 6) | 0xC0);
        bytes.push((charCode & 0x3F) | 0x80);
      } else if (0xFFFF >= charCode) {
        bytes.push((charCode >> 12) | 0xE0);
        bytes.push(((charCode >> 6) & 0x3F) | 0x80);
        bytes.push((charCode & 0x3F) | 0x80);
      } else {
        throw new Error('UTF-8 characters greater than 0xFFFF are not supported');
      }

      for (var j in bytes) {
        var byte = bytes[j].toString(16).toUpperCase();

        while (2 > byte.length) {
          byte = '0' + byte;
        }

        escapedString += '%' + byte;
      }
    }
  }

  return escapedString;
};

/**
 * A generic query-based request.
 */
var QueryRequest = function() {
  Request.call(this);

  var self                      = this;
  self.method                   = 'POST';
  self.headers['Content-Type']  = 'application/x-www-form-urlencoded; charset=utf-8';
}

util.inherits(QueryRequest, Request);

/**
 * Signs the request with the given key and signature.
 *
 * @param   {String}  accessKeyId
 * @param   {String}  signature
 * @return  {Request}
 */
QueryRequest.prototype.sign = function(accessKeyId, signature) {
  var self                  = this;
  self.query.AWSAccessKeyId = accessKeyId;
  self.query.Signature      = signature;

  return self;
}

/**
 * Returns the string to sign.
 *
 * @param   {String}  accessKeyId
 * @return  {String}
 */
QueryRequest.prototype.getStringToSign = function(accessKeyId) {
  var self        = this;
  var query       = {};
  var queryNames  = [];
  var sortedQuery = {};

  for (var key in self.query) {
    query[key] = self.query[key];
  }

  query.AWSAccessKeyId = accessKeyId;

  for (var name in query) {
    queryNames.push(name);
  }

  queryNames.sort();

  for (var i in queryNames) {
    var queryName           = queryNames[i];
    sortedQuery[queryName]  = query[queryName];
  }

  var stringToSign  = self.method + "\n"
                    + self.host.toLowerCase() + "\n"
                    + self.path + "\n"
                    + self.stringifyQuery(sortedQuery);

  return stringToSign;
}

/**
 * Returns the body of the request.
 *
 * @return  {String}
 */
QueryRequest.prototype.getBody = function() {
  return this.stringifyQuery(this.query);
}

/**
 * A generic REST-based request.
 */
var RestRequest = function() {
  Request.call(this);

  var self  = this;
  var xml   = null;

  self.xml = function(rootElement, namespace) {
    if (null == xml) {
      if ('undefined' !== typeof rootElement) {
        xml = new libxmljs.Document();

        var rootNode = xml.node(rootElement);

        if ('undefined' !== typeof namespace) {
          rootNode.namespace(namespace);
        }
      }
    }

    return xml;
  };
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

  if (self.xml()) {
    options.headers['Content-Type'] = 'text/xml; charset=utf-8';
  }

  if (0 < Object.keys(self.query).length) {
    options.path += '?' + self.stringifyQuery(self.query);
  }

  return options;
}

/**
 * Returns the request body.
 *
 * @return  {String}
 */
RestRequest.prototype.getBody = function() {
  if (null == this.xml()) {
    return '';
  }

  return this.xml().toString();
}

/**
 * A generic AWS response object.
 *
 * @param   {Object}  httpResponse
 */
var Response = function(httpResponse) {
  var self        = this;
  var xml         = null;
  self.requestId  = null;
  self.data       = {};

  self.__defineGetter__('headers', function() {
    return httpResponse.headers;
  });

  self.__defineGetter__('body', function() {
    return httpResponse.body;
  })

  self.__defineGetter__('xml', function() {
    return xml;
  });

  if (0 < self.body.length &&
    (
      null == self.headers['content-type'] ||
      0 == self.headers['content-type'].indexOf('text/xml') ||
      self.body.match(/^\<\?xml/)
    )
  ) {
    xml = libxmljs.parseXmlString(
      self.body.replace(/ ?xmlns="(.*?)"/, '')
    );
  }
};

/**
 * Converts an XML element into JSON. Ignores attributes and does not support
 * elements with the same name.
 *
 * @param   {Object}  xml
 * @returns {Object}
 */
Response.prototype.xmlToJson = function(xml) {
  if (null == xml) {
    return null;
  }

  var self      = this;
  var json      = null;
  var children  = xml.childNodes();

  if (1 == children.length && 'text' == children[0].type()) {
    json = children[0].text();
  } else if (0 < children.length) {
    json = {};

    for (var i in children) {
      var child = children[i];

      if ('element' != child.type()) {
        continue;
      }

      var name = child.name();

      json[name] = self.xmlToJson(child);
    }
  }

  return json;
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
 * @param   {Object}  data
 */
var ResponseException = function(message, code, requestId, data) {
  Exception.call(this, message, code);

  var self        = this;
  self.requestId  = requestId;

  if (data) {
    self.data = data;
  }
}

module.exports.services           = services;
module.exports.Service            = Service;
module.exports.Client             = Client;
module.exports.Credentials        = Credentials;
module.exports.QueryRequest       = QueryRequest;
module.exports.RestRequest        = RestRequest;
module.exports.Response           = Response;
module.exports.Exception          = Exception;
module.exports.ResponseException  = ResponseException;
var
  util = require('util'),
  crypto = require('crypto'),
  aws = require('./aws'),
  _ = require('./util');

// Version Information
var version = module.exports.version  = '2006-03-01';
var xmlns   = module.exports.xmlns    = 'http://doc.s3.amazonaws.com/' + version + '/';
var methods = module.exports.methods  = {
  'createBucket': true,
  'deleteBucket': true,
  'deleteObject': true,
  'getObject': true,
  'listAllMyBuckets': true,
  'listBucket': true,
  'putObject': true,
}

/**
 * A generic S3 request.
 *
 * @param   {Object}  args
 * @param   {String}  action
 */
var Request = module.exports.Request = function(args, method) {
  aws.RestRequest.call(this, args, 's3.amazonaws.com', method, '/');
}

util.inherits(Request, aws.RestRequest);

/**
 * Returns the string to sign.
 *
 * @param   {String}  accessKeyId
 * @return  {String}
 */
Request.prototype.getStringToSign = function(accessKeyId) {
  var self    = this;
  var content = self.getBody();
  var md5     = '';

  if (0 < content.length) {
    md5 = crypto.createHash('md5').update(content).digest('base64');
  }

  var amzHeaders        = {};
  var amzHeadersSorted  = [];

  for (var name in self._headers) {
    if (0 != name.toLowerCase().indexOf('x-amz-')) {
      continue;
    }

    amzHeaders[name.toLowerCase()] = name;

    amzHeadersSorted.push(name.toLowerCase());
  }

  amzHeadersSorted.sort();

  for (var i in amzHeadersSorted) {
    var name  = amzHeadersSorted[i];
    var value = self._headers[amzHeaders[name]];
    value     = value.replace(/[\r\n]/g, ' ');

    amzHeadersSorted[i] = name + ':' + value + "\n";
  }

  var stringToSign  = self._method + "\n"
                    + md5 + "\n"
                    + self._headers['Content-Type'] + "\n"
                    + self._date.toUTCString() + "\n"
                    + amzHeadersSorted.join()
                    + self._path;

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
  aws.RestRequest.prototype.sign.call(this, accessKeyId, signature);

  this._headers['Authorization']  = 'AWS ' + _.asString(accessKeyId)
                                  + ':' + _.asString(signature);

  return this;
}

/**
 * A generic S3 response.
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  aws.Response.call(this, response);

  var self = this;

  if (self._xml) {
    var error = _.xmlToJson(self._xml.get('/Error'));

    if (error) {
      throw new aws.ResponseException(
        error.Message,
        error.Code,
        error.RequestId
      );
    }
  }

  self.requestId = response.headers['x-amz-request-id'];
}

util.inherits(Response, aws.Response);
var
  util = require('util'),
  s3 = require('../s3'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET Bucket
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  s3.Request.call(this, args, 'GET');

  var self    = this;
  args.bucket = _.asString(args.bucket);

  if (0 == args.bucket.length) {
    throw new aws.Exception('args.bucket must be a string', 'InvalidBucketName');
  }

  self._path += args.bucket;

  if (null != args.delimiter) {
    self._query['delimiter'] = _.asString(args.delimiter);
  }

  if (null != args.marker) {
    self._query['marker'] = _.asString(args.marker);
  }

  if (null != args.maxKeys) {
    self._query['max-keys'] = _.asString(args.maxKeys);
  }

  if (null != args.prefix) {
    self._query['prefix'] = _.asString(args.prefix);
  }
}

util.inherits(Request, s3.Request);

/**
 * ListBucketResponse
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  s3.Response.call(this, response);

  var self          = this;
  var xmlRoot       = self._xml.get('/ListBucketResult');
  var xmlContents   = xmlRoot.find('./Contents');
  self.name         = _.xmlToJson(xmlRoot.get('./Name'));
  self.prefix       = _.xmlToJson(xmlRoot.get('./Prefix'));
  self.marker       = _.xmlToJson(xmlRoot.get('./Marker'));
  self.maxKeys      = parseInt(_.xmlToJson(xmlRoot.get('./MaxKeys')));
  self.isTruncated  = 'true' == _.xmlToJson(xmlRoot.get('./IsTruncated'));
  self.contents     = [];

  for (var i in xmlContents) {
    var obj = _.xmlToJson(xmlContents[i]);

    self.contents.push({
      key: obj.Key,
      lastModified: new Date(obj.LastModified),
      eTag: obj.ETag.replace(/"/g, ""),
      size: _.asInteger(obj.Size),
      storageClass: obj.StorageClass,
      owner: {
        id: obj.Owner.ID,
        displayName: obj.Owner.DisplayName,
      },
    });
  }
}

util.inherits(Response, s3.Response);

module.exports.Request  = Request;
module.exports.Response = Response;
var
  util = require('util'),
  s3 = require('../S3'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * GET Bucket
 *
 * @param   {Object}  args
 */
var Request = function(args) {
  s3.Request.call(this, Response, args, 'GET', '/');

  var query = this._query;

  if (null != args.delimiter) {
    if (!_.isString(args.delimiter)) {
      throw new Error('args.delimiter must be a string or null');
    }

    query['delimiter'] = args.delimiter;
  }

  if (null != args.marker) {
    if (!_.isString(args.marker)) {
      throw new Error('args.marker must be a string or null');
    }

    query['marker'] = args.marker;
  }

  if (null != args.maxKeys) {
    if (!_.isInteger(args.maxKeys)) {
      throw new Error('args.maxKeys must be an integer or null');
    }

    query['max-keys'] = args.maxKeys;
  }

  if (null != args.prefix) {
    if (!_.isString(args.prefix)) {
      throw new Error('args.prefix must be a string or null');
    }

    query['prefix'] = args.prefix;
  }
}

util.inherits(Request, s3.Request);

/**
 * ListBucketResponse
 *
 * @param   {Object}  headers
 * @param   {String}  data
 */
var Response = function(headers, data) {
  s3.Response.call(this, headers, data);

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
      size: parseInt(obj.Size),
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
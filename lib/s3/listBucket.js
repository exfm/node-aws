/**
 * GET Bucket
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method  = 'GET';
  request.path   += args.bucket;

  if ('undefined' !== typeof args.delimiter) {
    request.query['delimiter'] = args.delimiter;
  }

  if ('undefined' !== typeof args.marker) {
    request.query['marker'] = args.marker;
  }

  if ('undefined' !== typeof args.maxKeys) {
    request.query['max-keys'] = args.maxKeys;
  }

  if ('undefined' !== typeof args.prefix) {
    request.query['prefix'] = args.prefix;
  }
};

/**
 * ListBucketResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var xmlRoot               = response.xml.get('/ListBucketResult');
  response.data.name        = response.xmlToJson(xmlRoot.get('./Name'));
  response.data.prefix      = response.xmlToJson(xmlRoot.get('./Prefix'));
  response.data.marker      = response.xmlToJson(xmlRoot.get('./Marker'));
  response.data.maxKeys     = parseInt(response.xmlToJson(xmlRoot.get('./MaxKeys')));
  response.data.isTruncated = 'true' === response.xmlToJson(xmlRoot.get('./IsTruncated'));
  response.data.contents    = [];

  xmlRoot.find('./Contents').forEach(function(xmlContents) {
    var contents = response.xmlToJson(xmlContents);

    response.data.contents.push({
      key: contents.Key,
      lastModified: new Date(contents.LastModified),
      eTag: contents.ETag,
      size: parseInt(contents.Size),
      storageClass: contents.StorageClass,
      owner: {
        id: contents.Owner.ID,
        displayName: contents.Owner.DisplayName,
      },
    });
  });
};
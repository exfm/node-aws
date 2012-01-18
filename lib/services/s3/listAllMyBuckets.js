/**
 * GET Service
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method = 'GET';
};

/**
 * ListAllMyBucketsResult
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var xmlRoot           = response.xml.get('/ListAllMyBucketsResult');
  var owner             = response.xmlToJson(xmlRoot.get('./Owner'));
  response.data.buckets = [];
  response.data.owner   = {
    id: owner.ID,
    displayName: owner.DisplayName,
  };

  xmlRoot.find('./Buckets/Bucket').forEach(function(xmlBucket) {
    var bucket = response.xmlToJson(xmlBucket);

    response.data.buckets.push({
      name: bucket.Name,
      creationDate: new Date(bucket.CreationDate),
    });
  });
};
var
util = require('util'),
elastiCache = require('../elastiCache'),
aws = require('../aws'),
_ = require('../util');

/**
 * GET DescribeCacheClusters
 *
 * @param   {Object}  args
 */
var Request = module.exports.Request = function(args) {
  elastiCache.Request.call(this, args, 'DescribeCacheClusters');

  var self  = this;
  var query = self._query;

  if (null != args.cacheClusterId) {
    query['CacheClusterId'] = _.asString(args.cacheClusterId);
  }

  if (null != args.marker) {
    query['Marker'] = _.asString(args.marker);
  }

  if (null != args.showCacheNodeInfo) {
    query['ShowCacheNodeInfo']= _.asBoolean(args.showCacheNodeInfo);
  }

  if (null != args.maxRecords) {
    query['MaxRecords'] = _.asString(args.maxRecords);
  }
};

util.inherits(Request, elastiCache.Request);

/**
 * ListResourceRecordSetsResponse
 *
 * @param   {Object}  response
 */
var Response = module.exports.Response = function(response) {
  elastiCache.Response.call(this, response);

  var self                  = this;
  var xmlRoot               = self._xml.get('/DescribeCacheClustersResponse');
  var xmlCacheClusters = xmlRoot.find('./DescribeCacheClustersResult/CacheClusters/CacheCluster');
  self.cacheClusters   = [];

  for (var i in xmlCacheClusters) {
    var xmlCacheCluster  = xmlCacheClusters[i];
    console.log( xmlCacheCluster.toString() );
    var xmlCacheNodes    = xmlCacheCluster.find('./CacheNodes/CacheNode');
    var cacheCluster     = {
    cacheClusterId: _.xmlToJson(xmlCacheCluster.get('./CacheClusterId')),
    cacheClusterStatus: _.xmlToJson(xmlCacheCluster.get('./CacheClusterStatus')),
    cacheNodeType: _.xmlToJson(xmlCacheCluster.get('./CacheNodeType')),
    engine: _.xmlToJson(xmlCacheCluster.get('./Engine')),
    preferredAvailabilityZone: _.xmlToJson(xmlCacheCluster.get('./PreferredAvailabilityZone')),
    cacheNodes : [],
    };

    for (var j in xmlCacheNodes) {
        var xmlCacheNode  = xmlCacheNodes[j];
        console.log( xmlCacheNode.toString() );
      var cacheNode     = {
        endpoint : {
          address : _.xmlToJson(xmlCacheNode.get('./Endpoint/Address')),
          port : _.xmlToJson(xmlCacheNode.get('./Endpoint/Port'))
        }
      }
      cacheCluster.cacheNodes.push(cacheNode);
    }

    self.cacheClusters.push(cacheCluster);
  }
};

util.inherits(Response, elastiCache.Response);
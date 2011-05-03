var
  util = require('util'),
  sdb = require('../SimpleDB'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * GET DomainMetadata
 */
var Request = function(args) {
  sdb.Request.call(this, Response, args, 'DomaisnMetadata');

  var self  = this;
  var query = self._query;

  if (null != args.domainName) {
    query['DomainName'] = _.asString(args.domainName);
  }
}

util.inherits(Request, sdb.Request);

/**
 * DomainMetadataResponse
 */
var Response = function(response) {
  sdb.Response.call(this, response);

  var self      = this;
  var metadata  = _.xmlToJson(self._xml.get('/DomainMetadataResponse/DomainMetadataResult'));

  self.itemCount                = _.asInteger(metadata.ItemCount);
  self.itemNamesSizeBytes       = _.asInteger(metadata.ItemNamesSizeBytes);
  self.attributeNameCount       = _.asInteger(metadata.AttributeNameCount);
  self.attributeNamesSizeBytes  = _.asInteger(metadata.AttributeNamesSizeBytes);
  self.attributeValueCount      = _.asInteger(metadata.AttributeValueCount);
  self.attributeValuesSizeBytes = _.asInteger(metadata.AttributeValuesSizeBytes);
  self.timestamp                = _.asInteger(metadata.Timestamp);
}

util.inherits(Response, sdb.Response);

module.exports.Request  = Request;
module.exports.Response = Response;
var
  util = require('util'),
  sdb = require('../SimpleDB'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * GET DomainMetadata
 */
var Request = function(args) {
  sdb.Request.call(this, Response, args, 'DomainMetadata');

  var self  = this;
  var query = self._query;

  if (!_.isString(args.domainName)) {
    throw new Error('args.domainName must be a string');
  }

  query['DomainName'] = args.domainName;
}

util.inherits(Request, sdb.Request);

/**
 * DomainMetadataResponse
 */
var Response = function(headers, data) {
  sdb.Response.call(this, headers, data);

  var self      = this;
  var metadata  = _.xmlToJson(self._xml.get('/DomainMetadataResponse/DomainMetadataResult'));

  self.itemCount                = parseInt(metadata.ItemCount);
  self.itemNamesSizeBytes       = parseInt(metadata.ItemNamesSizeBytes);
  self.attributeNameCount       = parseInt(metadata.AttributeNameCount);
  self.attributeNamesSizeBytes  = parseInt(metadata.AttributeNamesSizeBytes);
  self.attributeValueCount      = parseInt(metadata.AttributeValueCount);
  self.attributeValuesSizeBytes = parseInt(metadata.AttributeValuesSizeBytes);
  self.timestamp                = parseInt(metadata.Timestamp);
}

util.inherits(Response, sdb.Response);

module.exports.Request  = Request;
module.exports.Response = Response;
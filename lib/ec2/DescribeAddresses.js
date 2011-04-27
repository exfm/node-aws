var
  util = require('util'),
  aws = require('../aws'),
  ec2 = require('../ec2');

/**
 * DescribeAddressesRequest
 */
var Request = function() {
  ec2.Request.call(this, Response, 'DescribeAddresses');

  var self            = this;
  self._publicIPs     = [];
  self._allocationIDs = [];
  self._filters       = [];
}

util.inherits(Request, ec2.Request);

/**
 * Adds a public IP to the request.
 *
 * @param   {String}  publicIP
 * @return  {Request}
 */
Request.prototype.addPublicIP = function(publicIP) {
  var self            = this;
  var i               = self._publicIPs.length;
  var key             = 'PublicIp.' + i;
  self._publicIPs[i]  = publicIP;
  self._query[key]    = publicIP;

  return this;
}

/**
 * Adds an allocation ID to the request.
 *
 * @param   {String}  allocationID
 * @return  {Request}
 */
Request.prototype.addAllocationID = function(allocationID) {
  var self                = this;
  var i                   = self._allocationIDs.length;
  var key                 = 'AllocationId.' + i;
  self._allocationIDs[i]  = allocationID;
  self._query[key]        = allocationID;

  return this;
}

/**
 * Adds a filter to the request.
 *
 * @param   {String}  name
 * @param   {Array}   values
 */
Request.prototype.addFilter = function(name, values) {
  var self                  = this;
  var i                     = self._filters.length;
  var key                   = 'Filter.' + i + '.';
  self._filters[i]          = {name: name, values: values};
  self._query[key + 'Name'] = name;

  for (var j in values) {
    self._query[key + 'Value.' + j] = values[j];
  }

  return this;
}

/**
 * DescribeAddressesResponse
 */
var Response = function(headers, data) {
  ec2.Response.call(this, headers, data);
  var self        = this;
  self.addresses  = [];
  var xmlItems    = self._xml.find('/DescribeAddressesResponse/addressesSet/item');

  for (var i in xmlItems) {
    var xmlItem = aws.xmlToJSON(xmlItems[i]);

    self.addresses.push({
      publicIP: xmlItem.publicIp,
      allocationID: xmlItem.allocationId,
      domain: xmlItem.domain,
      instanceID: xmlItem.instanceId,
      associationID: xmlItem.associationId,
    });
  }
}

util.inherits(Response, ec2.Response);

module.exports.Request  = Request;
module.exports.Response = Response;
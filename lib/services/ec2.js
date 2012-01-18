var
  util = require('util'),
  aws = require('../aws');

// Version Information
var version         = '2011-12-15';
var xmlns           = 'http://ec2.amazonaws.com/doc/' + version + '/';
var defaultEndpoint = 'ec2.amazonaws.com';
var methods         = [
  // Amazon DevPay
  //'confirmProductInstance',

  // AMIs
  //'createImage',
  //'deregisterImage',
  //'describeImageAttribute',
  //'describeImages',
  //'modifyImageAttribute',
  //'registerImage',
  //'resetImageAttribute',

  // Availability Zones and Regions
  'describeAvailabilityZones',
  'describeRegions',

  // Customer Gateways (Amazon VPC)
  //'createCustomerGateway',
  //'deleteCustomerGateway',
  //'describeCustomerGateways',

  // DHCP Options (Amazon VPC)
  //'associateDhcpOptions',
  //'createDhcpOptions',
  //'deleteDhcpOptions',
  //'describeDhcpOptions',

  // Elastic Block Store
  //'attachVolume',
  //'createSnapshot',
  //'createVolume',
  //'deleteSnapshot',
  //'deleteVolume',
  //'describeSnapshotAttribute',
  //'describeSnapshots',
  //'describeVolumes',
  //'detachVolume',
  //'importVolume',
  //'modifySnapshotAttribute',
  //'resetSnapshotAttribute',

  // Elastic IP Addresses
  'allocateAddress',
  'associateAddress',
  'describeAddresses',
  'disassociateAddress',
  'releaseAddress',

  // Elastic Network Interfaces
  //'attachNetworkInterface',
  //'detachNetworkInterface',
  //'createNetworkInterface',
  //'deleteNetworkInterface',
  //'describeNetworkInterfaces',
  //'describeNetworkInterfaceAttribute',
  //'modifyNetworkInterfaceAttribute',
  //'resetNetworkInterfaceAttribute',

  // General
  'getConsoleOutput',

  // Instances
  //'describeInstanceAttribute',
  'describeInstances',
  //'describeInstanceStatus',
  //'importInstance',
  //'modifyInstanceAttribute',
  'rebootInstances',
  //'reportInstanceStatus',
  //'resetInstanceAttribute',
  //'runInstances',
  'startInstances',
  'stopInstances',
  //'terminateInstances',

  // Internet Gateways (Amazon VPC)
  //'attachInternetGateway',
  //'createInternetGateway',
  //'deleteInternetGateway',
  //'describeInternetGateways',
  //'detachInternetGateway',

  // Key Pairs
  'createKeyPair',
  'deleteKeyPair',
  'describeKeyPairs',
  'importKeyPair',

  // Monitoring
  //'monitorInstances',
  //'unmonitorInstances',

  // Network ACLs (Amazon VPC)
  //'createNetworkAcl',
  //'createNetworkAclEntry',
  //'deleteNetworkAcl',
  //'deleteNetworkAclEntry',
  //'describeNetworkAcls',
  //'replaceNetworkAclAssociation',
  //'replaceNetworkAclEntry',

  // Placement Groups
  //'createPlacementGroup',
  //'deletePlacementGroup',
  //'describePlacementGroups',

  // Reserved Instances
  //'describeReservedInstances',
  //'describeReservedInstancesOfferings',
  //'purchaseReservedInstancesOffering',

  // Route Tables (Amazon VPC)
  //'associateRouteTable',
  //'createRoute',
  //'createRouteTable',
  //'deleteRoute',
  //'deleteRouteTable',
  //'describeRouteTables',
  //'disassociateRouteTable',
  //'replaceRoute',
  //'replaceRouteTableAssociation',

  // Security Groups
  //'authorizeSecurityGroupEgress', // (Amazon VPC security groups only)
  //'authorizeSecurityGroupIngress',
  //'createSecurityGroup',
  //'deleteSecurityGroup',
  //'describeSecurityGroups',
  //'revokeSecurityGroupEgress', // (Amazon VPC security groups only)
  //'revokeSecurityGroupIngress',

  // Spot Instances
  //'cancelSpotInstanceRequests',
  //'createSpotDatafeedSubscription',
  //'deleteSpotDatafeedSubscription',
  //'describeSpotDatafeedSubscription',
  //'describeSpotInstanceRequests',
  //'describeSpotPriceHistory',
  //'requestSpotInstances',

  // Subnets (Amazon VPC)
  //'createSubnet',
  //'deleteSubnet',
  //'describeSubnets',

  // Tags
  //'createTags',
  //'deleteTags',
  //'describeTags',

  // VM Import
  //'cancelConversionTask',
  //'describeConversionTasks',
  //'importInstance',
  //'importVolume',

  // VPCs (Amazon VPC)
  //'createVpc',
  //'deleteVpc',
  //'describeVpcs',

  // VPN Connections (Amazon VPC)
  //'createVpnConnection',
  //'deleteVpnConnection',
  //'describeVpnConnections',

  // Virtual Private Gateways (Amazon VPC)
  //'attachVpnGateway',
  //'createVpnGateway',
  //'deleteVpnGateway',
  //'describeVpnGateways',
  //'detachVpnGateway',

  // Windows
  //'bundleInstance',
  //'cancelBundleTask',
  //'describeBundleTasks',
  //'getPasswordData',
];

/**
 * A generic EC2 request.
 */
var Request = function(endpoint) {
  aws.QueryRequest.call(this);

  var self                    = this;
  self.host                   = endpoint || defaultEndpoint;
  self.query.Version          = version;
  self.query.SignatureMethod  = 'Hmac' + self.signatureAlgorithm.toUpperCase();
  self.query.SignatureVersion = 2;
  self.query.Timestamp        = self.date.toISOString().replace(/\.[0-9]{0,3}Z$/, 'Z');
}

util.inherits(Request, aws.QueryRequest);

/**
 * Parses the given arguments, adding any filters to the request.
 *
 * @param   {Object}  args
 */
Request.prototype.encodeFilters = function(args) {
  var self = this;

  if (util.isArray(args.filters)) {
    for (var i in args.filters) {
      var filter = args.filters[i];

      if (filter instanceof Object) {
        if ('undefined' !== typeof filter.name) {
          self.query['Filter.' + i  +'.Name'] = filter.name;
        }

        if (util.isArray(filter.values)) {
          for (var j in filter.values) {
            self.query['Filter.' + i  +'.Value.' + j] = filter.values[i];
          }
        }
      }
    }
  }
}

/**
 * A generic EC2 response.
 *
 * @param   {Object}  httpResponse
 */
var Response = module.exports.Response = function(httpResponse) {
  aws.Response.call(this, httpResponse);

  var self  = this;
  var error = self.xmlToJson(self.xml.get('/Response/Errors/Error'));

  if (error) {
    throw new aws.ResponseException(
      error.Message,
      error.Code,
      self.xmlToJson(self.xml.get('/Response/RequestID'))
    );
  }

  self.requestId = self.xml.root().get('./requestId').text();
}

util.inherits(Response, aws.Response);

// Exports
module.exports.version          = version;
module.exports.xmlns            = xmlns;
module.exports.defaultEndpoint  = defaultEndpoint;
module.exports.methods          = methods;
module.exports.methodPath       = __dirname + '/ec2/';
module.exports.Request          = Request;
module.exports.Response         = Response;
/**
 * GET DescribeInstances
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DescribeImages';
  
  if (Array.isArray(args.owner)) {
    for (var i in args.owner) {
      request.query['Owner.' + i] = args.owner[i];
    }
  }
  
  request.encodeFilters(args);
}

/**
 * DescribeInstancesResponse
 *
 * @param   {Response}  Response
 */
module.exports.decodeResponse = function(response) {
  
  //console.log(response.xml.toString())  
  response.data.images = []
  response.xml.find('/DescribeImagesResponse/imagesSet/item').forEach(function(xmlImage) {
    var image = response.xmlToJson(xmlImage)
    image.tagSet = []
    xmlImage.find('./tagSet/item').forEach(function(xmlTagSet){            
      image.tagSet.push(response.xmlToJson(xmlTagSet))      
    })    
    image.blockDeviceMapping = []
    xmlImage.find('./blockDeviceMapping/item').forEach(function(xmlBlockMapping){            
      image.blockDeviceMapping.push(response.xmlToJson(xmlBlockMapping))      
    }) 
    
    response.data.images.push(image)
  })
  
    /*
    var groups    = [];
    var instances = [];

    xmlReservation.find('./groupSet/item').forEach(function(xmlGroup) {
      groups.push(response.xmlToJson(xmlGroup));
    });

    xmlReservation.find('./instancesSet/item').forEach(function(xmlInstance) {
      var instance          = response.xmlToJson(xmlInstance);
      var productCodes      = [];
      var instanceGroups    = [];
      var blockDevices      = [];
      var tags              = [];
      var networkInterfaces = [];

      xmlInstance.find('./productCodes/item').forEach(function(xmlProductCode) {
        productCodes.push(response.xmlToJson(xmlProductCode));
      });

      xmlInstance.find('./groupSet/item').forEach(function(xmlGroup) {
        instanceGroups.push(response.xmlToJson(xmlGroup));
      });

      xmlInstance.find('./blockDeviceMapping/item').forEach(function(xmlBlockDevice) {
        var blockDevice                     = response.xmlToJson(xmlBlockDevice);
        blockDevice.ebs.attachTime          = new Date(blockDevice.ebs.attachTime);
        blockDevice.ebs.deleteOnTermination = 'true' === blockDevice.ebs.deleteOnTermination;

        blockDevices.push(blockDevice);
      });

      xmlInstance.find('./tagSet/item').forEach(function() {
        // undefined
      });

      xmlInstance.find('./networkInterfaceSet/item').forEach(function(xmlNetworkInterface) {
        var networkInterface        = response.xmlToJson(xmlNetworkInterface);
        var networkInterfaceGroups  = [];

        xmlNetworkInterface.find('./groupSet/item').forEach(function(xmlGroup) {
          networkInterfaceGroups.push(response.xmlToJson(xmlGroup));
        });

        networkInterfaces.push({
          networkInterfaceId: networkInterface.networkInterfaceId,
          subnetId: networkInterface.subnetId,
          vpcId: networkInterface.vpcId,
          description: networkInterface.description,
          ownerId: networkInterface.ownerId,
          status: networkInterface.status,
          privateIpAddress: networkInterface.privateIpAddress,
          sourceDestCheck: networkInterface.sourceDestCheck,
          groups: networkInterfaceGroups,
          attachment: {
            attachmentId: networkInterface.attachment.attachmentmentId,
            deviceIndex: parseInt(networkInterface.attachment.deviceIndex),
            status: networkInterface.attachment.status,
            attachTime: new Date(networkInterface.attachment.attachTime),
            deleteOnTermination: 'true' === networkInterface.attachment.deleteOnTermination,
          }
        });
      });

      instances.push({
        instanceId: instance.instanceId,
        imageId: instance.imageId,
        instanceState: {
          code: parseInt(instance.instanceState.code),
          name: instance.instanceState.name,
        },
        privateDnsName: instance.privateDnsName,
        dnsName: instance.dnsName,
        reason: instance.reason,
        keyName: instance.keyName,
        amiLaunchIndex: parseInt(instance.amiLaunchIndex),
        productCodes: productCodes,
        instanceType: instance.instanceType,
        launchTime: new Date(instance.launchTime),
        placement: instance.placement,
        kernelId: instance.kernelId,
        monitoring: instance.monitoring,
        groups: instanceGroups,
        stateReason: instance.stateReason,
        architecture: instance.architecture,
        rootDeviceType: instance.rootDeviceType,
        rootDeviceName: instance.rootDeviceName,
        blockDeviceMapping: blockDevices,
        virtualizationType: instance.virtualizationType,
        clientToken: instance.clientToken,
        hypervisor: instance.hypervisor,
        networkInterfaces: networkInterfaces,
      });
    });

    response.data.reservations.push({
      reservationId: response.xmlToJson(xmlReservation.get('./reservationId')),
      ownerId: response.xmlToJson(xmlReservation.get('./ownerId')),
      groups: groups,
      instances: instances,
      requesterId: response.xmlToJson(xmlReservation.get('./requesterId')),
    });
  });*/

}
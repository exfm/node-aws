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
  
 

}
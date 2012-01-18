/**
 * GET ListVerifiedEmailAddresses
 */
module.exports.encodeRequest = function(request) {
  request.query['Action'] = 'ListVerifiedEmailAddresses';
}

/**
 * ListVerifiedEmailAddressesResponse
 */
module.exports.decodeResponse = function(response) {
  var xmlItems = response.xml.find('/ListVerifiedEmailAddressesResponse/ListVerifiedEmailAddressesResult/VerifiedEmailAddresses/member');

  response.data.verifiedEmailAddresses = [];

  for (var i in xmlItems) {
    response.data.verifiedEmailAddresses.push(response.xmlToJson(xmlItems[i]));
  }
}
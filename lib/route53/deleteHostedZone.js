/**
 * DELETE DeleteHostedZone
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method  = 'DELETE';
  request.path   += args.id;
}

/**
 * DeleteHostedZoneResponse
 *
 * @param   {Object}  response
 */
module.exports.decodeResponse = function(response) {
  var changeInfo            = response.xmlToJson(response.xml.get('/DeleteHostedZoneResponse/ChangeInfo'));
  response.data.changeInfo  = {
    id: changeInfo.Id,
    status: changeInfo.Status,
    submittedAt: new Date(changeInfo.SubmittedAt),
  };
}
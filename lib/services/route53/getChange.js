/**
 * GET GetChange
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.method  = 'GET';
  request.path   += args.id;
}

/**
 * GetChangeResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  var xml         = response.xml.get('/GetChangeResponse');
  var changeInfo  = response.xmlToJson(xml.get('./ChangeInfo'));

  response.data.changeInfo = {
    id: changeInfo.Id,
    status: changeInfo.Status,
    submittedAt: new Date(changeInfo.SubmittedAt),
  };
}
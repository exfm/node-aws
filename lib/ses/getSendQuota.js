/**
 * GET GetSendQuota
 */
module.exports.encodeRequest = function(request) {
  request.query['Action'] = 'GetSendQuota';
}

/**
 * GetSendQuotaResponse
 */
module.exports.decodeResponse = function(response) {
  var result  = response.xmlToJson(response.xml.get('/GetSendQuotaResponse/GetSendQuotaResult'));

  response.data.sentLast24Hours = parseFloat(result.SentLast24Hours);
  response.data.max24HourSend   = parseFloat(result.Max24HourSend);
  response.data.maxSendRate     = parseFloat(result.MaxSendRate);
}
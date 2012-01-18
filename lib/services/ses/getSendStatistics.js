/**
 * GET GetSendStatistics
 */
module.exports.encodeRequest = function(request) {
  request.query['Action'] = 'GetSendStatistics';
}

/**
 * GetSendStatisticsResponse
 */
module.exports.decodeResponse = function(response) {
  var dataPoints = response.xmlToJson(
    response.xml.get('/GetSendStatisticsResponse/GetSendStatisticsResult/SendDataPoints/member')
  );

  response.data.deliveryAttempts  = parseInt(dataPoints.DeliveryAttempts);
  response.data.timestamp         = new Date(dataPoints.Timestamp);
  response.data.rejects           = parseInt(dataPoints.Rejects);
  response.data.bounces           = parseInt(dataPoints.Bounces);
  response.data.complaints        = parseInt(dataPoints.Complaints);
}
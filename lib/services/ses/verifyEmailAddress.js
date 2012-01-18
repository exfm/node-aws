/**
 * GET VerifyEmailAddress
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action']       = 'VerifyEmailAddress';
  request.query['EmailAddress'] = args.emailAddress;
}

/**
 * VerifyEmailAddressResponse
 */
module.exports.decodeResponse = function() {};
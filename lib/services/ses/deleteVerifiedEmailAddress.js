/**
 * GET DeleteVerifiedEmailAddress
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action']       = 'DeleteVerifiedEmailAddress';
  request.query['EmailAddress'] = args.emailAddress;
}

/**
 * DeleteVerifiedEmailAddressResponse
 */
module.exports.decodeResponse = function() {};
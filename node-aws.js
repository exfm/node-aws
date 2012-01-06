var aws = require('./lib/aws');

/**
 * Creates an AWS client with the given credentials.
 *
 * @param   {String}  accessKeyId
 * @param   {String}  secretAccessKey
 * @param   {Object}  endpoints
 * @returns {Client}
 */
module.exports.createClient = function(accessKeyId, secretAccessKey, endpoints) {
  var credentials = new aws.Credentials(accessKeyId, secretAccessKey);

  return new aws.Client(credentials, endpoints);
};
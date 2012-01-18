var util = require('util');

/**
 * GET DeleteAttributes
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'DeleteAttributes';

  if ('undefined' !== typeof args.domainName) {
    request.query['DomainName'] = args.domainName;
  }

  if ('undefined' !== typeof args.itemName) {
    request.query['ItemName'] = args.itemName;
  }

  if (util.isArray(args.attributes)) {
    for (var i in args.attributes) {
      var attribute = args.attributes[i];

      if (attribute instanceof Object) {
        if ('undefined' !== typeof attribute.name) {
          request.query['Attribute.' + i + '.Name'] = attribute.name;
        }

        if ('undefined' !== typeof attribute.value) {
          request.query['Attribute.' + i + '.Value'] = attribute.value;
        }
      }
    }
  }

  if (util.isArray(args.expecteds)) {
    for (var i in args.expecteds) {
      var expected = args.expecteds[i];

      if (expected instanceof Object) {
        if ('undefined' !== typeof expected.value) {
          request.query['Expected.' + i + '.Name'] = expected.name;
        }

        if ('undefined' !== typeof expected.value) {
          request.query['Expected.' + i + '.Value'] = expected.value;
        }

        if ('undefined' !== typeof expected.exists) {
          request.query['Expected.' + i + '.Exists'] = expected.exists;
        }
      }
    }
  }
}

/**
 * DeleteAttributesResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
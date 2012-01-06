var util = require('util');

/**
 * GET PutAttributes
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'PutAttributes';

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

        if ('undefined' !== typeof attribute.replace) {
          request.query['Attribute.' + i + '.Replace'] = attribute.replace;
        }
      }
    }
  }

  if (util.isArray(args.expecteds)) {
    for (var i in args.expecteds) {
      var expected = args.expecteds[i];

      if (expected instanceof Object) {
        if ('undefined' !== typeof expected.name) {
          query['Expected.' + i + '.Name'] = expected.name;
        }

        if ('undefined' !== typeof expected.value) {
          query['Expected.' + i + '.Value'] = expected.value;
        }

        if ('undefined' !== typeof expected.exists) {
          query['Expected.' + i + '.Exists'] = expected.exists;
        }
      }
    }
  }
}

/**
 * PutAttributesResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
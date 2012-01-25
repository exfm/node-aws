/**
 * GET BatchDeleteAttributes
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'BatchDeleteAttributes';

  if ('undefined' !== typeof args.domainName) {
    request.query['DomainName'] = args.domainName;
  }

  if (Array.isArray(args.items)) {
    for (var i in args.items) {
      var item = args.items[i];

      if (item instanceof Object) {
        if ('undefined' !== typeof item.itemName) {
          request.query['Item.' + i + '.ItemName'] = item.itemName;
        }

        if (Array.isArray(item.attributes)) {
          for (var j in item.attributes) {
            var attribute = item.attributes[j];

            if (attribute instanceof Object) {
              if ('undefined' !== typeof attribute.name) {
                request.query['Item.' + i + '.Attribute.' + j + '.Name'] = attribute.name;
              }

              if ('undefined' !== typeof attribute.value) {
                request.query['Item.' + i + '.Attribute.' + j + '.Value'] = attribute.value;
              }
            }
          }
        }
      }
    }
  }
}

/**
 * BatchDeleteAttributesResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
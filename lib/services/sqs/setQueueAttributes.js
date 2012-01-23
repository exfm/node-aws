/**
 * GET SetQueueAttributes
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'SetQueueAttributes';

  request.encodeQueueUrl(args);

  if (args.attribute && args.attribute instanceof Object) {
    if ('undefined' !== typeof args.attribute.name) {
      request.query['Attribute.Name'] = args.attribute.name;
    }

    if ('undefined' !== typeof args.attribute.value) {
      switch (args.attribute.name) {
        case 'Policy': {
          if ('object' === typeof args.attribute.value && !(args.attribute.value instanceof String)) {
            args.attribute.value = JSON.stringify(args.attribute.value);
          }

          break;
        }
      }

      request.query['Attribute.Value'] = args.attribute.value;
    }
  }
}

/**
 * SetQueueAttributesResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {};
var util = require('util');

/**
 * GET CreateQueue
 *
 * @param   {Request} request
 * @param   {Object}  args
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'CreateQueue';

  if ('undefined' !== typeof args.queueName) {
    request.query['QueueName'] = args.queueName;
  }

  if (util.isArray(args.attributes)) {
    for (var i = 0; i < args.attributes.length; i++) {
      var attribute = args.attributes[i];

      if (attribute instanceof Object) {
        switch (attribute.name) {
          case 'Policy':
            if ('object' === typeof attribute.value && !(attribute.value instanceof String)) {
              attribute.value = JSON.stringify(attribute.value);
            }

            break;
        }

        request.query['Attribute.' + (i + 1) + '.Name']  = attribute.name;
        request.query['Attribute.' + (i + 1) + '.Value'] = attribute.value;
      }
    };
  }
};

/**
 * CreateQueueResponse
 *
 * @param   {Response}  response
 */
module.exports.decodeResponse = function(response) {
  response.data.queueUrl = response.xmlToJson(response.xml.get('/CreateQueueResponse/CreateQueueResult/QueueUrl'));
};
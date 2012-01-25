/**
 * GET SendEmail
 *
 * @sample
 */
module.exports.encodeRequest = function(request, args) {
  request.query['Action'] = 'SendEmail';

  if (args.destination instanceof Object) {
    if (Array.isArray(args.destination.bccAddresses)) {
      for (var i in args.destination.bccAddresses) {
        request.query['Destination.BccAddresses.member.' + (i + 1)] = args.destination.bccAddresses[i];
      }
    }

    if (Array.isArray(args.destination.ccAddresses)) {
      for (var i in args.destination.ccAddresses) {
        request.query['Destination.CcAddresses.member.' + (i + 1)] = args.destination.ccAddresses[i];
      }
    }

    if (Array.isArray(args.destination.toAddresses)) {
      for (var i in args.destination.toAddresses) {
        request.query['Destination.ToAddresses.member.' + (i + 1)] = args.destination.toAddresses[i];
      }
    }
  }

  if (args.message instanceof Object) {
    if (args.message.body instanceof Object) {
      if (args.message.body.html instanceof Object) {
        if (null != args.message.body.html.charset) {
          request.query['Message.Body.Html.Charset'] = args.message.body.html.charset;
        }

        if (null != args.message.body.html.data) {
          request.query['Message.Body.Html.Data'] = args.message.body.html.data;
        }
      }

      if (args.message.body.text instanceof Object) {
        if (null != args.message.body.text.charset) {
          request.query['Message.Body.Text.Charset'] = args.message.body.text.charset;
        }

        if (null != args.message.body.text.data) {
          request.query['Message.Body.Text.Data'] = args.message.body.text.data;
        }
      }
    }

    if (args.message.subject instanceof Object) {
      if (null != args.message.subject.charset) {
        request.query['Message.Subject.Charset'] = args.message.subject.charset;
      }

      if (null != args.message.subject.data) {
        request.query['Message.Subject.Data'] = args.message.subject.data;
      }
    }
  }

  if (Array.isArray(args.replyToAddresses)) {
    for (var i in args.replyToAddresses) {
      request.query['ReplyToAddresses.member.' + (i + 1)] = args.replyToAddresses[i];
    }
  }

  if (null != args.returnPath) {
    request.query['ReturnPath'] = args.returnPath;
  }

  if (null != args.source) {
    request.query['Source'] = args.source;
  }
}

/**
 * SendEmailResponse
 */
module.exports.decodeResponse = function(response) {
  response.data.messageId = response.xmlToJson(response.xml.get('/SendEmailResponse/SendEmailResult/MessageId'));
}
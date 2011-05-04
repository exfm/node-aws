var
  util = require('util'),
  ec2 = require('../ec2'),
  ses = require('../ses'),
  _ = require('../util');

/**
 * GET SendEmail
 */
var Request = module.exports.Request = function(args) {
  ses.Request.call(this, args, 'SendEmail');

  var self = this;

  if (_.isObject(args.destination)) {
    if (_.isArray(args.destination.bccAddresses)) {
      for (var i in args.destination.bccAddresses) {
        self._query['Destination.BccAddresses.member.' + (i + 1)] = _.asString(args.destination.bccAddresses[i]);
      }
    }

    if (_.isArray(args.destination.ccAddresses)) {
      for (var i in args.destination.ccAddresses) {
        self._query['Destination.CcAddresses.member.' + (i + 1)] = _.asString(args.destination.ccAddresses[i]);
      }
    }

    if (_.isArray(args.destination.toAddresses)) {
      for (var i in args.destination.toAddresses) {
        self._query['Destination.ToAddresses.member.' + (i + 1)] = _.asString(args.destination.toAddresses[i]);
      }
    }
  }

  if (_.isObject(args.message)) {
    if (_.isObject(args.message.body)) {
      if (_.isObject(args.message.body.html)) {
        if (null != args.message.body.html.charset) {
          self._query['Message.Body.Html.Charset'] = _.asString(args.message.body.html.charset);
        }

        if (null != args.message.body.html.data) {
          self._query['Message.Body.Html.Data'] = _.asString(args.message.body.html.data);
        }
      }

      if (_.isObject(args.message.body.text)) {
        if (null != args.message.body.text.charset) {
          self._query['Message.Body.Text.Charset'] = _.asString(args.message.body.text.charset);
        }

        if (null != args.message.body.text.data) {
          self._query['Message.Body.Text.Data'] = _.asString(args.message.body.text.data);
        }
      }
    }

    if (_.isObject(args.message.subject)) {
      if (null != args.message.subject.charset) {
        self._query['Message.Subject.Charset'] = _.asString(args.message.subject.charset);
      }

      if (null != args.message.subject.data) {
        self._query['Message.Subject.Data'] = _.asString(args.message.subject.data);
      }
    }
  }

  if (_.isArray(args.replyToAddresses)) {
    for (var i in args.replyToAddresses) {
      self._query['ReplyToAddresses.member.' + (i + 1)] = _.asString(args.replyToAddresses[i]);
    }
  }

  if (null != args.returnPath) {
    self._query['ReturnPath'] = _.asString(args.returnPath);
  }

  if (null != args.source) {
    self._query['Source'] = _.asString(args.source);
  }
}

util.inherits(Request, ses.Request);

/**
 * SendEmailResponse
 */
var Response = module.exports.Response = function(response) {
  ses.Response.call(this, response);

  var self        = this;
  self.messageId  = _.xmlToJson(self._xml.get('/SendEmailResponse/SendEmailResult/MessageId'));
}

util.inherits(Response, ses.Response);
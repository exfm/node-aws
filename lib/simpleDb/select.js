var
  util = require('util'),
  sdb = require('../simpleDb'),
  aws = require('../aws'),
  _ = require('../util');

/**
 * GET Select
 */
var Request = module.exports.Request = function(args) {
  sdb.Request.call(this, args, 'Select');

  var self  = this;
  var query = self._query;

  if (null != args.selectExpression) {
    query['SelectExpression'] = _.asString(args.selectExpression);
  }

  if (null != args.consistentRead) {
    query['ConsistentRead'] = _.asString(args.consistentRead);
  }

  if (null != args.nextToken) {
    query['NextToken'] = _.asString(args.nextToken);
  }
}

util.inherits(Request, sdb.Request);

/**
 * SelectResponse
 */
var Response = module.exports.Response = function(response) {
  sdb.Response.call(this, response);

  var self      = this;
  var xmlResult = self._xml.get('/SelectResponse/SelectResult');
  var xmlItems  = xmlResult.find('./Item');
  self.items    = [];

  for (var i in xmlItems) {
    var xmlItem       = xmlItems[i];
    var xmlAttributes = xmlItem.find('./Attribute');
    var item          = {
      name: _.xmlToJson(xmlItem.get('./Name')),
      attributes: [],
    };

    for (var j in xmlAttributes) {
      var xmlAttribute      = xmlAttributes[j];
      var xmlName           = xmlAttribute.get('./Name');
      var xmlValue          = xmlAttribute.get('./Value');
      var xmlNameEncoding   = xmlName.attr('encoding');
      var xmlValueEncoding  = xmlValue.attr('encoding');
      var name              = _.xmlToJson(xmlName);
      var value             = _.xmlToJson(xmlValue);

      if (xmlValueEncoding && 'base64' == xmlValueEncoding.value()) {
        var buffer  = new Buffer(value, 'base64');
        value       = buffer.toString();
      }

      item.attributes.push({
        name: name,
        value: value,
      });
    }

    self.items.push(item);
  }

  self.nextToken = _.xmlToJson(xmlResult.get('./NextToken'));
}

util.inherits(Response, sdb.Response);
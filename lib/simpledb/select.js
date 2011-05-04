var
  util = require('util'),
  sdb = require('../simpledb'),
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
      var attribute = _.xmlToJson(xmlAttributes[j]);

      item.attributes.push({
        name: attribute.Name,
        value: attribute.Value,
      });
    }

    self.items.push(item);
  }

  self.nextToken = _.xmlToJson(xmlResult.get('./NextToken'));
}

util.inherits(Response, sdb.Response);
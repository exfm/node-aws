var
  util = require('util'),
  sdb = require('../SimpleDB'),
  aws = require('../../aws'),
  _ = require('../../util');

/**
 * GET Select
 */
var Request = function(args) {
  sdb.Request.call(this, Response, args, 'Select');

  var self  = this;
  var query = self._query;

  if (!_.isString(args.selectExpression)) {
    throw new Error('args.selectExpression must be string');
  }

  query['SelectExpression'] = args.selectExpression;

  if (null != args.consistentRead) {
    if (!_.isBoolean(args.consistentRead)) {
      throw new Error('args.consistentRead must be a boolean or null');
    }

    query['ConsistentRead'] = (args.consistentRead) ? 'true' : 'false';
  }

  if (null != args.nextToken) {
    if (!_.isString(args.nextToken)) {
      throw new Error('args.nextToken must be a string or null');
    }

    query['NextToken'] = nextToken;
  }
}

util.inherits(Request, sdb.Request);

/**
 * SelectResponse
 */
var Response = function(headers, data) {
  sdb.Response.call(this, headers, data);

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

module.exports.Request  = Request;
module.exports.Response = Response;
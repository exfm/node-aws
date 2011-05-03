var querystring = require('querystring');

/**
 * Converts the given variable to a string. NULL, undefined, and NaN
 * return null.
 *
 * @param   {Object}  arg
 * @return  {String}
 */
var asString = function(arg) {
  if (null == arg || NaN == arg) {
    return null;
  }

  if (isBoolean(arg)) {
    return (arg) ? 'true' : 'false';
  }

  return (new String(arg)).toString();
}

/**
 * Checks if the given variable is a string or String object.
 *
 * @param   {Object}    arg
 * @param   {Boolean}   allowNull
 * @return  {Boolean}
 */
var isString = function(arg, allowNull) {
  if (null == arg) {
    return true == allowNull;
  }

  return arg instanceof String || typeof arg == 'string';
}

/**
 * Checks if the given variable is a number or Number object.
 *
 * @param   {Object}    arg
 * @param   {Boolean}   allowNull
 * @return  {Boolean}
 */
var isNumber = function(arg, allowNull) {
  if (null == arg) {
    return true == allowNull;
  }

  return arg instanceof Number || typeof arg == 'number' || !isNaN(parseFloat(arg));
}

/**
 * Checks if the given variable is an integer Number or String.
 *
 * @param   {Object}    arg
 * @param   {Boolean}   allowNull
 * @return  {Boolean}
 */
var isInteger = function(arg, allowNull) {
  if (!isNumber(arg, allowNull)) {
    return false;
  }

  return (parseInt(arg) + "") == (arg + "");
}

/**
 * Checks if the given variable is an boolean or Boolean object.
 *
 * @param   {Object}    arg
 * @param   {Boolean}   allowNull
 * @return  {Boolean}
 */
var isBoolean = function(arg, allowNull) {
  if (null == arg) {
    return true == allowNull;
  }

  return arg instanceof Boolean || typeof arg == "boolean";
}

/**
 * Checks if the given variable is instance of Object.
 *
 * @param   {Object}    arg
 * @param   {Boolean}   allowNull
 * @return  {Boolean}
 */
var isObject = function(arg, allowNull) {
  return instanceOf(arg, Object, allowNull);
}

/**
 * Checks if the given variable is instance of Array.
 *
 * @param   {Object}    arg
 * @param   {Boolean}   allowNull
 * @return  {Boolean}
 */
var isArray = function(arg, allowNull) {
  return instanceOf(arg, Array, allowNull);
}

/**
 * Checks if the given varaible is an instance of the given type.
 *
 * @param   {Object}    arg
 * @param   {Function}  type
 * @param   {Boolean}   allowNull
 */
var instanceOf = function(arg, type, allowNull) {
  if (null == arg) {
    return true == allowNull;
  }

  return arg instanceof type;
}

/**
 * Converts an XML element into JSON. Ignores attributes and does not support
 * elements with the same name.
 *
 * @param   {Object}  xml
 * @return  {Object}
 */
var xmlToJson = function(xml) {
  if (null == xml) {
    return null;
  }

  var json      = null;
  var children  = xml.childNodes();

  if (1 == children.length && 'text' == children[0].type()) {
    json = children[0].text();
  } else if (0 < children.length) {
    json = {};

    for (var i in children) {
      var child = children[i];

      if ('element' != child.type()) {
        continue;
      }

      var name = child.name();

      json[name] = xmlToJson(child);
    }
  }

  return json;
}

/**
 * Serialize an object to a query string using AWS-specific rules.
 *
 * @param   {Object}  query
 * @return  {String}
 */
var stringifyQuery = function(query) {
  var oldEscape       = querystring.escape;
  querystring.escape  = escape;
  var stringified     = querystring.stringify(query);
  querystring.escape  = oldEscape;

  return stringified;
}

/**
 * Escapes a string using AWS-specific rules.
 *
 * @param   {String}  string
 * @return  {String}
 */
var escape = function(string) {
  var string        = string + '';
  var escapedString = '';

  for (var i = 0; i < string.length; i++) {
    var charCode = string.charCodeAt(i);

    if (45 == charCode ||                       // -
        46 == charCode ||                       // .
        95 == charCode ||                       // _
        126 == charCode ||                      // ~
        (48 <= charCode && 57 >= charCode) ||   // 0-9
        (65 <= charCode && 90 >= charCode) ||   // A-Z
        (97 <= charCode && 122 >= charCode)) {  // a-z
      escapedString += string.charAt(i);
    } else if (255 >= charCode) {
      escapedString += '%' + charCode.toString(16).toUpperCase();
    } else {
      var charCode = charCode.toString(16).toUpperCase();

      while (4 > charCode.length) {
        charCode = '0' + charCode;
      }

      escapedString += '%' + charCode.substring(0, 2)
                     + '%' + charCode.substring(2, 4);
    }
  }

  return escapedString;
}

module.exports.asString       = asString;
module.exports.isString       = isString;
module.exports.isNumber       = isNumber;
module.exports.isInteger      = isInteger;
module.exports.isBoolean      = isBoolean;
module.exports.isObject       = isObject;
module.exports.isArray        = isArray;
module.exports.instanceOf     = instanceOf;
module.exports.xmlToJson      = xmlToJson;
module.exports.escape         = escape;
module.exports.stringifyQuery = stringifyQuery;
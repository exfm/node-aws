var querystring = require('querystring');

/**
 * Converts the given variable to a string. NULL, undefined, and NaN
 * return null.
 *
 * @param   {Object}  arg
 * @return  {String}
 */
var asString = module.exports.asString = function(arg) {
  if (null == arg) {
    return '';
  }

  if (isBoolean(arg)) {
    return (arg) ? 'true' : 'false';
  }

  return (new String(arg)).toString();
}

/**
 * Converts the given variable to an integer. NaN returns null.
 *
 * @param   {Object}  arg
 * @return  {String}
 */
var asInteger = module.exports.asInteger = function(arg) {
  arg = parseInt(arg);

  if (isNaN(arg)) {
    return null;
  }

  return arg;
}

/**
 * Converts the given variable to a float. NaN returns null.
 *
 * @param   {Object}  arg
 * @return  {String}
 */
var asFloat = module.exports.asFloat = function(arg) {
  arg = parseFloat(arg);

  if (isNaN(arg)) {
    return null;
  }

  return arg;
}

/**
 * Converts the given variable to a boolean.
 *
 * @param   {Object}  arg
 * @return  {Boolean}
 */
var asBoolean = module.exports.asBoolean = function(arg) {
  if (isString(arg)) {
    return 'true' == arg;
  }

  return true == (new Boolean(arg));
}

/**
 * Checks if the given variable is a string or String object.
 *
 * @param   {Object}    arg
 * @param   {Boolean}   allowNull
 * @return  {Boolean}
 */
var isString = module.exports.isString = function(arg, allowNull) {
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
var isNumber = module.exports.isNumber = function(arg, allowNull) {
  if (null == arg) {
    return true == allowNull;
  }

  return arg instanceof Number || typeof arg == 'number' || null != asFloat(arg);
}

/**
 * Checks if the given variable is an integer Number or String.
 *
 * @param   {Object}    arg
 * @param   {Boolean}   allowNull
 * @return  {Boolean}
 */
var isInteger = module.exports.isInteger = function(arg, allowNull) {
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
var isBoolean = module.exports.isBoolean = function(arg, allowNull) {
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
var isObject = module.exports.isObject = function(arg, allowNull) {
  return instanceOf(arg, Object, allowNull);
}

/**
 * Checks if the given variable is instance of Array.
 *
 * @param   {Object}    arg
 * @param   {Boolean}   allowNull
 * @return  {Boolean}
 */
var isArray = module.exports.isArray = function(arg, allowNull) {
  return instanceOf(arg, Array, allowNull);
}

/**
 * Checks if the given varaible is an instance of the given type.
 *
 * @param   {Object}    arg
 * @param   {Function}  type
 * @param   {Boolean}   allowNull
 */
var instanceOf = module.exports.instanceOf = function(arg, type, allowNull) {
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
var xmlToJson = module.exports.xmlToJson = function(xml) {
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
var stringifyQuery = module.exports.stringifyQuery = function(query) {
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
var escape = module.exports.escape = function(string) {
  var string        = asString(string);
  var escapedString = '';

  for (var i = 0; i < string.length; i++) {
    var charCode = string.charCodeAt(i);

    if (0x002D == charCode ||                         // -
        0x002E == charCode ||                         // .
        0x005F == charCode ||                         // _
        0x007E == charCode ||                         // ~
        (0x0030 <= charCode && 0x0039 >= charCode) || // 0-9
        (0x0041 <= charCode && 0x005A >= charCode) || // A-Z
        (0x0061 <= charCode && 0x007A >= charCode)) { // a-z
      escapedString += string.charAt(i);
    } else {
      var bytes = [];

      // http://en.wikipedia.org/wiki/UTF-8#Description
      if (0x007F >= charCode) {
        bytes.push(charCode);
      } else if (0x07FF >= charCode) {
        bytes.push((charCode >> 6) | 0xC0);
        bytes.push((charCode & 0x3F) | 0x80);
      } else if (0xFFFF >= charCode) {
        bytes.push((charCode >> 12) | 0xE0);
        bytes.push(((charCode >> 6) & 0x3F) | 0x80);
        bytes.push((charCode & 0x3F) | 0x80);
      } else {
        throw new Error('UTF-8 characters greater than 0xFFFF are not supported');
      }

      for (var j in bytes) {
        var byte = bytes[j].toString(16).toUpperCase();

        while (2 > byte.length) {
          byte = '0' + byte;
        }

        escapedString += '%' + byte;
      }
    }
  }

  return escapedString;
}
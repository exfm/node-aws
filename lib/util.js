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

module.exports.isString   = isString;
module.exports.isNumber   = isNumber;
module.exports.isInteger  = isInteger;
module.exports.instanceOf = instanceOf;
module.exports.xmlToJson  = xmlToJson;
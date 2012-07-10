var libxmljs = require("libxmljs");

var camelize = function(str){
    return str.replace(str.charAt(0), str.charAt(0).toLowerCase());
};

module.exports.xmlToObject = function(xmlString){
    function parse(xml){
        var json = {},
            children  = xml.childNodes();
        if (children.length === 1 && children[0].type() === 'text') {
            return children[0].text();
        }
        else if(children.length > 0){
            children.forEach(function(child){
                if(child.type() === 'element'){
                   var name = camelize(child.name());
                    if(name === 'member' || name === 'item' || name === 'bucket' || name === 'contents'){
                        if(json.length === undefined){
                            json = [];
                        }
                        json.push(parse(child));
                    }
                    else{
                        json[camelize(name)] = parse(child);
                    }
                }
            });
            return json;
        }
    }

    var xml = libxmljs.parseXmlString(xmlString),
        response = {};
    response[camelize(xml.root().name())] = parse(xml);
    return response;
};

module.exports.sortObjectByKeys = function(obj){
    var keys = Object.keys(obj),
        result = {};
    keys.sort();
    keys.forEach(function(key){
        result[key] = obj[key];
    });
    return result;
};



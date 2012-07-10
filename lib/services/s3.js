var util = require('util'),
  crypto = require('crypto'),
  Connection = require('../aws').Connection,
  when = require('when'),
  https = require('https'),
  common = require('../common'),
  winston = require('winston'),
  querystring = require('querystring');

var log = winston.loggers.get('aws');

function S3(accessKeyId, secretAccessKey){
    S3.super_.call(this, accessKeyId, secretAccessKey,
        's3.amazonaws.com', '2006-03-01');
    this.autoParseResponse = false;

    this.CANNED_ACLS = {
        'PRIVATE': "private",
        'PUBLIC_READ': "public-read",
        'PUBLIC_READ_WRITE': "public-read-write",
        'AUTHENTICATED_READ': "authenticated-read",
        'BUCKET_OWNER_READ': "bucket-owner-read",
        'BUCKET_OWNER_FULL_CONTROL': "bucket-owner-full-control",
        'LOG_DELIVERY_WRITE': "log-delivery-write"
    };
}

util.inherits(S3, Connection);

S3.prototype.getSignature = function(verb, path, headers){
    var strToSign, amzHeaders = {}, val, hmac, headerValues;
    Object.keys(headers).forEach(function(key){
        if (key.toLowerCase().indexOf('x-amz-') > -1) {
            val = headers[key].replace(/[\r\n]/g, ' ');
            key = key.toLowerCase();
            amzHeaders[key] = util.format("%s:%s", key, val);
        }
    });
    amzHeaders = common.sortObjectByKeys(amzHeaders);
    headerValues = Object.keys(amzHeaders).map(function(k){
        return amzHeaders[k];
    });

    strToSign = [
        verb,
        headers['Content-MD5'],
        (headers['Content-Type'] || ''),
        headers.Date
    ];

    if(headerValues.length > 0){
        strToSign.push(headerValues.join("\n"));
    }
    strToSign.push(path);
    strToSign = strToSign.join("\n");
    hmac = crypto.createHmac('sha1', this.secretAccessKey);
    return hmac.update(strToSign).digest('base64');
};

S3.prototype.makeRequest = function(path, verb, headers, cb, body, params){
    verb = verb || 'GET', path = path || '/',
        headers = headers || {}, body = body || '', params = params || {};

    var d = when.defer(),
        response = '',
        paramString = '',
        req, opts;


    // Set up our request
    opts = {
        'host': this.host,
        'path': path,
        'headers': {},
        'method': verb
    };

    opts.headers['Content-Length'] = body.length;
    opts.headers['Content-MD5'] =  crypto.createHash('md5').update(body).digest('base64');

    opts.headers.Date = new Date().toUTCString();

    // Copy in optional headers
    Object.keys(headers).forEach(function(key){
        opts.headers[key] = headers[key];
    });

    opts.headers.Authorization = util.format("AWS %s:%s", this.accessKeyId,
        this.getSignature(verb, path, opts.headers));

    log.silly('options', opts);
    log.silly('headers', headers);

    this.path += "?"+querystring.stringify(params);

    req = https.request(opts, function(res){
        res.on('data', function(chunk){
            response += chunk;
        });
        res.on('end', function(){
            var result = response;
            if(res.statusCode > 400){
                d.reject(new Error(
                    common.xmlToObject(response).errorResponse.error.message));
            }
            result = cb.apply(this, [result, res.headers]);
            return d.resolve(result);
        }.bind(this));
    }.bind(this));

    req.on('error', function(e) {
        d.reject(e);
    });

    req.end(body);
    return d.promise;
};

S3.prototype.createBucket = function(bucketName){
    return this.makeRequest(util.format("/%s", bucketName), 'PUT', {},
        function(response){
            return response;
        }
    );
};

S3.prototype.deleteBucket = function(bucketName){
    return this.makeRequest(util.format("/%s", bucketName), 'DELETE', {},
        function(response){
            return response;
        }
    );
};

S3.prototype.getObject = function(bucketName, key){
  return this.makeRequest(util.format("/%s/%s", bucketName, key), 'GET', {},
        function(response, headers){
            return {
                'content': response,
                'etag': headers.etag,
                'contentType': headers['content-type'],
                'lastModified': new Date(headers['last-modified'])
            };
        }
    );
};

S3.prototype.putObject = function(bucketName, key, content, opts){
    opts = opts || {};
    var headers = {
        'Content-Type': opts.contentType || 'application/json',
        'Expires': opts.expires || 6000
    };

    return this.makeRequest(util.format("/%s/%s", bucketName, key), 'PUT', headers,
        function(response, headers){
            return headers.etag;
        },
        content
    );
};

S3.prototype.deleteObject = function(bucketName, key){
    return this.makeRequest(util.format("/%s/%s", bucketName, key), 'DELETE', {},
        function(response, headers){
            return headers['x-amz-delete-marker'] === "true";
        }
    );
};

S3.prototype.listBuckets = function(){
    return this.makeRequest("/", 'GET', {},
        function(response, headers){
            return common.xmlToObject(response).listAllMyBucketsResult.buckets;
        }
    );
};

S3.prototype.listKeys = function(bucketName, opts){
    opts = opts || {};
    var params = {},
        optMap = {
            'prefix': 'prefix',
            'delimiter': 'delimiter',
            'maxKeys': 'max-keys',
            'marker': 'marker'
        };
    Object.keys(optMap).forEach(function(key){
        if(opts.hasOwnProperty(key)){
            params[optMap[key]] = opts[key];
        }
    });
    return this.makeRequest(util.format("/%s", bucketName), 'GET', {},
        function(response, headers){
            return common.xmlToObject(response).listBucketResult;
        }, '', params
    );

};

module.exports.S3 = S3;
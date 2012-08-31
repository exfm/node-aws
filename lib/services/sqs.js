"use strict";

var util = require('util'),
    common = require('../common'),
    Connection = require('../aws').Connection,
    when = require('when');

function SQS(accessKeyId, secretAccessKey){
    SQS.super_.call(this, accessKeyId, secretAccessKey,
        'sqs.us-east-1.amazonaws.com', '2011-10-01');
}
util.inherits(SQS, Connection);

SQS.prototype.createQueue = function(name, attributes) {
    var params = {'QueueName': name};

    if(attributes){
        Object.keys(attributes).forEach(function(name, index){
            var val = attributes[name];
            if(name === 'policy'){
                val = JSON.stringify(val);
            }
            params['Attribute.'+ (index + 1) +'.Name'] = common.toTitleCase(name);
            params['Attribute.'+ (index + 1) +'.Value'] = val;
        });
    }
    return this.makeRequest(function(response){
        return response.createQueueResponse.createQueueResult.queueUrl;
    }, 'CreateQueue', params);
};

SQS.prototype.deleteQueue = function(name) {
    return this.makeRequest(function(response){
        return response;
    }, 'DeleteQueue', {'QueueName': name});
};

SQS.prototype.listQueues = function(prefix){
    var params = {};
    if(prefix){
        params['QueueNamePrefix'] = prefix;
    }
    return this.makeRequest(function(response){
        return response;
    }, 'ListQueues', params);
};

SQS.prototype.getQueueUrl = function(opts) {
    var params = {};
    opts |= {};

    if(opts.name){
        params['QueueName'] = opts.name;
    }
    if(opts.ownerId){
        params['QueueOwnerAWSAccountId'] = opts.ownerId;
    }

    return this.makeRequest(function(response){
        return response;
    }, 'GetQueueUrl', params);
};

SQS.prototype.getQueueAttributes = function(url) {

};

SQS.prototype.setQueueAttributes = function(url) {

};

SQS.prototype.sendMessage = function(url, message, delay) {
    var params = {
            'MessageBody': message
        },
        queryUrl = url.parse(url);

    this.host = queryUrl.host;
    this.path = queryUrl.pathname;

    if(delay){
        params['DelaySeconds'] = delay;
    }
    return this.makeRequest(function(response){
        return response;
    }, 'SendMessage', params);
};

SQS.prototype.sendMessageBatch = function(url, batch) {
    var queryUrl = url.parse(url),
        params = {};

    this.host = queryUrl.host;
    this.path = queryUrl.pathname;

    batch.forEach(function(message, index){
        params['SendMessageBatchRequestEntry.' + (index + 1) + '.MessageBody'] = message;
    });

    return this.makeRequest(function(response){
        return response;
    }, 'SendMessageBatch', params);
};


SQS.prototype.receiveMessage = function(url, max, timeout) {
    var queryUrl = url.parse(url);
    max = max || 1;
    timeout = timeout || 30;

    var params = {
        'AttributeName.1': 'ALL',
        'MaxNumberOfMessages': max,
        'VisibilityTimeout': timeout
    };

    this.host = queryUrl.host;
    this.path = queryUrl.pathname;

    return this.makeRequest(function(response){
        return response;
    }, 'ReceiveMessage', params);
};


SQS.prototype.deleteMessage = function(url, receipt) {
    var queryUrl = url.parse(url),
        params = {};

    if(receipt){
        params['ReceiptHandle'] = receipt;
    }

    this.host = queryUrl.host;
    this.path = queryUrl.pathname;

    return this.makeRequest(function(response){
        return response;
    }, 'DeleteMessage', params);
};

SQS.prototype.deleteMessageBatch = function(url, ids, receipts){
    var queryUrl = url.parse(url),
        params = {};

    ids.forEach(function(id, index){
        params['DeleteMessageBatchRequestEntry.' + (index + 1) + '.Id'] = id;
        params['DeleteMessageBatchRequestEntry.' + (index + 1) + '.Receipthandle'] = receipts[index];
    });

    this.host = queryUrl.host;
    this.path = queryUrl.pathname;

    return this.makeRequest(function(response){
        return response;
    }, 'DeleteMessageBatch', params);
};

SQS.prototype.changeMessageVisibility = function(url, receipt, timeout){
    var queryUrl = url.parse(url),
        params = {
            'ReceiptHandle': receipt,
            'VisibilityTimeout': timeout
        };

    this.host = queryUrl.host;
    this.path = queryUrl.pathname;

    return this.makeRequest(function(response){
        return response;
    }, 'ChangeMessageVisibility', params);
};

SQS.prototype.changeMessageVisibilityBatch = function(){

};

SQS.prototype.getQueue = function(name){
    var d = when.defer();
    this.getQueueUrl(name).then(function(url){
        d.resolve(new Queue(url, this));
    }.bind(this));
    return d.promise;
};

module.exports.SQS = SQS;

// Simplify above.
function Queue(url, connection){
    this.url = url;
    this.connection = connection;
}

Queue.prototype.put = function(){

};

Queue.prototype.get = function(max, timeout){

};

function Message(){

}
Message.prototype.ack = function(){

};

// Update message visibility timeout to 0 so it gets picked up as soon
// as possbile by another worker.
Message.prototype.retry = function(){};

function MessageBatch(){

}

MessageBatch.prototype.ack = function(){

};
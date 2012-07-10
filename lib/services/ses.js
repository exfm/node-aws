var util = require('util'),
    Connection = require('../aws').Connection;

VerifyEmailIdentity

function SES(accessKeyId, secretAccessKey){
    SES.super_.call(this, accessKeyId, secretAccessKey,
        'email.us-east-1.amazonaws.com', '2010-12-01');
}
util.inherits(SES, Connection);

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_GetIdentityNotificationAttributes.html
SES.prototype.getIdentityNotificationAttributes = function(identities){

};

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_GetIdentityNotificationAttributes.html
SES.prototype.getIdentityVerificationAttributes = function(identities){

};

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_ListIdentities.html
SES.prototype.listIdentities = function(){

};

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_SendRawEmail.html
SES.prototype.sendRawEmail = function(){

};

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_SetIdentityFeedbackForwardingEnabled.html
SES.prototype.setIdentityFeedbackForwardingEnabled = function(){

};

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_SetIdentityNotificationTopic.html
SES.prototype.setIdentityNotificationTopic = function(){

};

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_VerifyDomainIdentity.html
SES.prototype.verifyDomainIdentity = function(){

};

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_VerifyEmailIdentity.html
SES.prototype.verifyEmailIdentity = function(){

};

SES.prototype.deleteIdentity = function(identity){
    return this.makeRequest(function(response){
        return response;
    }, 'DeleteIdentity', {'Identity': identity});
};

SES.prototype.verifyEmailAddress = function(email){
    return this.makeRequest(function(response){
        return response;
    }, 'VerifyEmailAddress', {'EmailAddress': email});
};

SES.prototype.deleteVerifiedEmailAddress = function(email){
    return this.makeRequest(function(response){
        return response;
    }, 'DeleteVerifiedEmailAddress', {'EmailAddress': email});
};

SES.prototype.listVerifiedEmailAddresses = function(){
    return this.makeRequest(function(response){
        return response.listVerifiedEmailAddressesResponse.listVerifiedEmailAddressesResult.verifiedEmailAddresses;
    }, 'ListVerifiedEmailAddresses');
};

SES.prototype.getSendQuota = function(){
    return this.makeRequest(function(response){
        return response.getSendQuotaResponse.getSendQuotaResult;
    }, 'GetSendQuota');
};

SES.prototype.getSendStatistics = function(){
    return this.makeRequest(function(response){
        return response.getSendStatisticsResponse.getSendStatisticsResult.sendDataPoints;
    }, 'GetSendStatistics');
};

SES.prototype.sendEmail = function(to, from, subject, html, text, opts){
    var returnPath = opts.returnPath || from,
        replyTo = opts.replyTo || from,
        source = opts.source || from,
        params;

    params = {
        'Source': source,
        'ReturnPath': returnPath,
        'Destination.ToAddresses.member.1': to,
        'ReplyToAddresses.member.1': replyTo,
        'Message.Subject.Data': subject,
        'Message.Body.Html.Data': html,
        'Message.Body.Text.Data': text

    };

    return this.makeRequest(function(response){
        return response.sendEmailResponse.sendEmailResult;
    }, 'SendEmail', params);
};
module.exports.SES = SES;
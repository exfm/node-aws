"use strict";

var common = require('../lib/common'),
    fs = require('fs'),
    assert = require('assert');

describe('Common', function(){
    describe('XML Parsing', function(){
        it("should make nice objects", function(done){
            fs.readFile(__dirname+'/xml/cloudsearch/describeDomains.xml', function(err, data){
                var result = common.xmlToObject(data);
                assert.equal(result.describeDomainsResponse.describeDomainsResult.domainStatusList.length, 6);
                done();
            });
        });
    });
});
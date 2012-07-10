var common = require('../lib/common'),
    fs = require('fs'),
    should = require('chai').should();

describe('Common', function(){
    describe('XML Parsing', function(){
        it("should make nice objects", function(done){
            fs.readFile(__dirname+'/xml/cloudsearch/describeDomains.xml', function(err, data){
                var result = common.xmlToObject(data);
                result.describeDomainsResponse.describeDomainsResult.domainStatusList.should.have.lengthOf(6);
                done();
            });
        });
    });
});
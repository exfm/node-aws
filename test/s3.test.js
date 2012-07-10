var aws = require('node-aws'),
    sequence = require('sequence');

aws.connect('025XPRCT7MMQMR921T02', 'BrQRYZXhft5h3vvN28hd5jiYXi09VHESkCEXMA2v');

sequence(aws).then(
    function(next){
        "use strict";
        aws.s3.createBucket('exfmnodetest').then(
            function(r){
                next();
            },
            function(err){
                console.error(err);
            }
        );
    }).then(
    function(next){
        "use strict";
        aws.s3.putObject('exfmnodetest', '1.json', JSON.stringify({'hello': 'world'})).then(
            function(r){
                console.log(r);
                next();
            },
            function(err){
                console.error(err);
            }
        );
    }).then(
    function(next){
        "use strict";
        aws.s3.listKeys('exfmnodetest').then(
            function(r){
                console.log(r);
            },
            function(err){
                console.error(err);
            }
        );
    });

// aws.s3.listBuckets().then(function(res){console.log(res);}, function(err){console.error(err);});

// var should = require('chai').should();

// var cs = require('../lib/services/cs.js');


// describe('Cloudsearch', function(){
//     describe('Response', function(){
//         it('should convert TitleCase XML to camelCase vars', function(done){
//             var req = new cs.Response({'headers': {}, 'body': ''});
//             var result = req.titleCaseToCamelCase('NumSearchableDocs');
//             result.should.equal('numSearchableDocs');
//         });
//     });
// });


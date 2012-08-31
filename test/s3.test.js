"use strict";

var aws = require('../');

aws.connect({'file': __dirname + '/auth.json'});

describe("S3", function(){
    describe("bucket", function(){
        it("should create a new bucket");
    });
    describe("key", function(){
        it("should create a new key");
    });
});

// sequence(aws).then(
//     function(next){
//         aws.s3.createBucket('exfmnodetest').then(
//             function(r){
//                 next();
//             },
//             function(err){
//                 console.error(err);
//             }
//         );
//     }).then(
//     function(next){
//         aws.s3.putObject('exfmnodetest', '1.json', JSON.stringify({'hello': 'world'})).then(
//             function(r){
//                 console.log(r);
//                 next();
//             },
//             function(err){
//                 console.error(err);
//             }
//         );
//     }).then(
//     function(next){
//         aws.s3.listKeys('exfmnodetest').then(
//             function(r){
//                 console.log(r);
//             },
//             function(err){
//                 console.error(err);
//             }
//         );
//     });


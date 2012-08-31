"use strict";

var aws = require('../'),
    sequence = require('sequence');

aws.connect({'file': __dirname + '/auth.json'});


aws.cloudsearch.describeDomains().then(
    function(domains){
        console.log(domains);
    },
    function(err){
        console.error(err);
    }
);

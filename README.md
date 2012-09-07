# node-aws

`node-aws` is an easy-to-use AWS client for node that supports a consistent
API across AWS services.

## Currently Supported Services

 * CloudSearch
 * CloudWatch
 * SQS
 * SES
 * SNS
 * EC2 (minimal)


## Usage

### S3

    var aws = require('aws'),
        fs = require('fs'),
        sequence = require('sequence');

    aws.connect();

    sequence(aws).then(function(next){
            fs.readFile('dan-queue.json', 'utf-8', next);
        }).then(function(next, err, data){
            aws.s3.putObject("queue.extension.fm", "dan.json", data).then(
                function(response){
                    console.log('Dan's queue updated on S3');
                },
                function(err){
                    console.error(err);
                }
            );
        }
    );




### CloudSearch

    var aws = require('node-aws');
    aws.connect();

    function addDocs(){
        var docClient = aws.cs.getSearchClient('doc-yourCloudsearchEndpoint>');
        docClient.add('1', '1', {'username': 'dan', 'location': 'New York, NY'});
        docClient.add('2', '1', {'username': 'danielle', 'location': 'Budapest, HU'});

        docClient.commit().then(
            function(result){
                console.log(result);
                searchByUsername('dan*');
            },
            function(err){
                console.error(err);
            }
        );
    }

    function searchByUsername(username){
        var searchClient = aws.cs.getSearchClient('search-yourCloudsearchEndpoint>');
        searchClient.search({
            'q': 'field username: '+username,
            'returnFields': ['username']}
        ).then(function(result){
            console.log('Results found: '+result.hits);
            console.log('Results: '+result.docs);
        }, function(err){
            console.error(err);
        });
    }

    aws.cs.createDomain().then(addDocs);

# Node AWS

Node AWS is an easy-to-use AWS client.

## Usage

```javascript
var aws = require('node-aws');

var client = aws.createClient({
  accessKeyId: '...',
  secretAccessKey: '...',
});

aws.request('simpledb', 'putAttributes', {
  domainName: "test",
  itemName: "item1",
  attributes: [
    {
      name: 'key1',
      value: 'val1',
    },
  ],
}, function(response) {
  if (response instanceof Error) {
    // uh oh
    console.log(response.code, response.message);
  } else {
    // it worked!
  }
})
```

## Status

The most up-to-date list of supported AWS services and methods is available by calling `require('node-aws')`. A potentially outdated list is provided below:

 * ec2
   * describeAddresses
 * route53
   * changeResourceRecordSets
   * createHostedZone
   * deleteHostedZone
   * getChange
   * getHostedZone
   * listHostedZones
   * listResourceRecordSets
 * s3
   * createBucket
   * deleteBucket
   * deleteObject
   * getObject
   * listAllMyBuckets
   * listBucket
   * putObject
 * ses
   * deleteVerifiedEmailAddress
   * getSendQuota
   * getSendStatistics
   * listVerifiedEmailAddresses
   * sendEmail
   * verifyEmailAddress
 * simpledb
   * batchDeleteAttributes
   * batchPutAttributes
   * createDomain
   * deleteAttributes
   * deleteDomain
   * domainMetadata
   * getAttributes
   * listDomains
   * putAttributes
   * select
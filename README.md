# node-aws

`node-aws` is an easy-to-use AWS client for node.

## Usage

```javascript
var aws = require('node-aws').createClient(
  'yourAccessKeyId',
  'yourSecretAccessKey',
  // You can optionally provide a hash of service endpoints,
  // but they each have reasonable defaults (typically US-East-1).
  {
    'sdb': 'sdb.eu-west-1.amazonaws.com',
  }
);

// All method request return a promise that will be fulfilled
// once the response is received and parsed.
aws.sdb.putAttributes(
  {
    domainName: "test",
    itemName: "item1",
    attributes: [
      {
        name: 'foo',
        value: 'bar',
      },
    ],
  },
  // You can optionally override the default endpoint on a
  // per-request basis as well.
  'sdb.ap-southeast-1.amazonaws.com'
).onSuccess(function() {
  // it worked!
  console.log(this.requestId, this.data);
}).onFailure(function() {
  // uh oh!
  console.log(this.requestId, this.error);
});
```

## Status

A potentially outdated list of supported AWS services and methods is provided below:

### EC2 (Elastic Compute Cloud)

 * allocateAddress
 * associateAddress
 * createKeyPair
 * deleteKeyPair
 * describeAddresses
 * describeAvailabilityZones
 * describeInstances
 * describeKeyPairs
 * describeRegions
 * disassociateAddress
 * getConsoleOutput
 * importKeyPair
 * rebootInstances
 * releaseAddress
 * startInstances
 * stopInstances

### Route53

 * changeResourceRecordSets
 * createHostedZone
 * deleteHostedZone
 * getChange
 * getHostedZone
 * listHostedZones
 * listResourceRecordSets

### S3 (Simple Storage Service)

 * createBucket
 * deleteBucket
 * deleteObject
 * getObject
 * listAllMyBuckets
 * listBucket
 * putObject

### SES (Simple Email Service)

 * deleteVerifiedEmailAddress
 * getSendQuota
 * getSendStatistics
 * listVerifiedEmailAddresses
 * sendEmail
 * verifyEmailAddress

### SimpleDB

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

### SNS (Simple Notification Service)

 * addPermission
 * confirmSubscription
 * createTopic
 * deleteTopic
 * getSubscriptionAttributes
 * getTopicAttributes
 * listSubscriptions
 * listSubscriptionsByTopic
 * listTopics
 * publish
 * removePermission
 * setSubscriptionAttributes
 * setTopicAttributes
 * subscribe
 * unsubscribe

### SQS (Simple Queue Service)

 * createQueue
 * deleteQueue
 * listQueues
 * getQueueUrl
 * getQueueAttributes
 * setQueueAttributes
 * addPermission
 * removePermission
 * sendMessage
 * sendMessageBatch
 * receiveMessage
 * deleteMessage
 * deleteMessageBatch
 * changeMessageVisibility
 * changeMessageVisibilityBatch

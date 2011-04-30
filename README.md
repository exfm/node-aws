# Node AWS

Node AWS is an easy-to-use AWS client.

## Usage

```javascript
var aws = require('node-aws');

var client = aws.createClient({
  accessKeyId: '...',
  secretAccessKey: '...',
});

var request = aws.createRequest('SimpleDB', 'PutAttributes', {
  domainName: "test",
  itemName: "item1",
  attributes: [
    {
      name: 'key1',
      value: 'val1',
    },
  ],
});

client.request(request, function(response) {
  if (response instancenof aws.ErrorResponse) {
    // uh oh
    console.log(response.code, response.message);
  } else {
    // it worked!
  }
})
```

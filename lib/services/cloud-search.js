"use strict";

var util = require('util'),
  Connection = require('../aws').Connection,
  when = require('when'),
  common = require('../common'),
  querystring = require('querystring'),
  http = require('http');

function CloudSearch(accessKeyId, secretAccessKey){
    CloudSearch.super_.call(this, accessKeyId, secretAccessKey,
        'cloudsearch.us-east-1.amazonaws.com', '2011-02-01');
    this.autoParseResponse = true;
}
util.inherits(CloudSearch, Connection);

CloudSearch.prototype.indexDocuments = function(name){
    return this.makeRequest(function(response){
        return response.indexDocumentsResponse.indexDocumentsResults.fieldNames;
    }, 'IndexDocuments', {'DomainName': name});
};

// <CreateDomainResponse xmlns="http://cloudsearch.amazonaws.com/doc/2011-02-01">
//   <CreateDomainResult>
//     <DomainStatus>
//       <SearchPartitionCount>0</SearchPartitionCount>
//       <SearchService>
//         <Arn>arn:aws:cs:us-east-1:160241911954:search/test</Arn>
//       </SearchService>
//       <NumSearchableDocs>0</NumSearchableDocs>
//       <Created>true</Created>
//       <DomainId>160241911954/test</DomainId>
//       <SearchInstanceCount>0</SearchInstanceCount>
//       <DomainName>test</DomainName>
//       <RequiresIndexDocuments>false</RequiresIndexDocuments>
//       <Deleted>false</Deleted>
//       <DocService>
//         <Arn>arn:aws:cs:us-east-1:160241911954:doc/test</Arn>
//       </DocService>
//     </DomainStatus>
//   </CreateDomainResult>
//   <ResponseMetadata>
//     <RequestId>2c392f2c-3880-11e1-9d03-0d7236ac6cae</RequestId>
//   </ResponseMetadata>
// </CreateDomainResponse>
CloudSearch.prototype.createDomain = function(name){
    return this.makeRequest(function(response){
        return response.createDomainResponse.createDomainResult.domainStatus;
    }, 'CreateDomain', {'DomainName': name});
};

// <DeleteDomainResponse xmlns="http://cloudsearch.amazonaws.com/doc/2011-02-01">
//  <DeleteDomainResult>
//    <DomainStatus>
//      <SearchPartitionCount>0</SearchPartitionCount>
//      <SearchService>
//        <Arn>arn:aws:cs:us-east-1:160241911954:search/test</Arn>
//        <Endpoint>search-test-qs2ho622mqqlyb3acbxrd2pgii.us-east-1.cloudsearch.amazonaws.com</Endpoint>
//      </SearchService>
//      <NumSearchableDocs>0</NumSearchableDocs>
//      <Created>true</Created>
//      <DomainId>160241911954/test</DomainId>
//      <SearchInstanceCount>0</SearchInstanceCount>
//      <DomainName>test</DomainName>
//      <RequiresIndexDocuments>false</RequiresIndexDocuments>
//      <Deleted>true</Deleted>
//      <DocService>
//        <Arn>arn:aws:cs:us-east-1:160241911954:doc/test</Arn>
//        <Endpoint>doc-test-qs2ho622mqqlyb3acbxrd2pgii.us-east-1.cloudsearch.amazonaws.com</Endpoint>
//      </DocService>
//    </DomainStatus>
//  </DeleteDomainResult>
//  <ResponseMetadata>
//    <RequestId>2b8a74a0-3887-11e1-8390-d3854e23e661</RequestId>
//  </ResponseMetadata>
// </DeleteDomainResponse>
CloudSearch.prototype.deleteDomain = function(name){
    return this.makeRequest(function(response){
        return response.deleteDomainResponse.deleteDomainResult.domainStatus;
    }, 'DeleteDomain', {'DomainName': name});
};

// <DescribeDomainsResponse xmlns="http://cloudsearch.amazonaws.com/doc/2011-02-01">
//   <DescribeDomainsResult>
//     <DomainStatusList>
//       <member>
//         <SearchPartitionCount>1</SearchPartitionCount>
//         <SearchService>
//           <Arn>arn:aws:cs:us-east-1:160241911954:search/song</Arn>
//           <Endpoint>search-song-3z775eq4lj2c6gdq2gwqxlq7zy.us-east-1.cloudsearch.amazonaws.com</Endpoint>
//         </SearchService>
//         <NumSearchableDocs>0</NumSearchableDocs>
//         <Created>true</Created>
//         <SearchInstanceType>search.m1.small</SearchInstanceType>
//         <DomainId>160241911954/song</DomainId>
//         <SearchInstanceCount>1</SearchInstanceCount>
//         <DomainName>song</DomainName>
//         <RequiresIndexDocuments>false</RequiresIndexDocuments>
//         <Deleted>false</Deleted>
//         <DocService>
//           <Arn>arn:aws:cs:us-east-1:160241911954:doc/song</Arn>
//           <Endpoint>doc-song-3z775eq4lj2c6gdq2gwqxlq7zy.us-east-1.cloudsearch.amazonaws.com</Endpoint>
//         </DocService>
//       </member>
//       <member>
//         <SearchPartitionCount>1</SearchPartitionCount>
//         <SearchService>
//           <Arn>arn:aws:cs:us-east-1:160241911954:search/test</Arn>
//           <Endpoint>search-test-qs2ho622mqqlyb3acbxrd2pgii.us-east-1.cloudsearch.amazonaws.com</Endpoint>
//         </SearchService>
//         <NumSearchableDocs>0</NumSearchableDocs>
//         <Created>true</Created>
//         <SearchInstanceType>search.m1.small</SearchInstanceType>
//         <DomainId>160241911954/test</DomainId>
//         <SearchInstanceCount>1</SearchInstanceCount>
//         <DomainName>test</DomainName>
//         <RequiresIndexDocuments>false</RequiresIndexDocuments>
//         <Deleted>false</Deleted>
//         <DocService>
//           <Arn>arn:aws:cs:us-east-1:160241911954:doc/test</Arn>
//           <Endpoint>doc-test-qs2ho622mqqlyb3acbxrd2pgii.us-east-1.cloudsearch.amazonaws.com</Endpoint>
//         </DocService>
//       </member>
//     </DomainStatusList>
//   </DescribeDomainsResult>
//   <ResponseMetadata>
//     <RequestId>09d2fa3d-3886-11e1-8390-d3854e23e661</RequestId>
//   </ResponseMetadata>
// </DescribeDomainsResponse>
CloudSearch.prototype.describeDomains = function() {
    return this.makeRequest(function(response){
        return response.describeDomainsResponse.describeDomainsResult.domainStatusList;
    }, 'DescribeDomains', {}, 'POST');
};

// <DefineIndexFieldResponse xmlns="http://cloudsearch.amazonaws.com/doc/2011-02-01">
//   <DefineIndexFieldResult>
//     <IndexField>
//       <Status>
//         <CreationDate>2012-01-06T18:48:09Z</CreationDate>
//         <UpdateVersion>6</UpdateVersion>
//         <State>RequiresIndexDocuments</State>
//         <UpdateDate>2012-01-06T18:48:09Z</UpdateDate>
//       </Status>
//       <Options>
//         <IndexFieldType>text</IndexFieldType>
//         <IndexFieldName>test</IndexFieldName>
//         <TextOptions>
//           <FacetEnabled>false</FacetEnabled>
//           <ResultEnabled>true</ResultEnabled>
//           <DefaultValue/>
//         </TextOptions>
//       </Options>
//     </IndexField>
//   </DefineIndexFieldResult>
//   <ResponseMetadata>
//     <RequestId>fa52420e-3896-11e1-9a3a-fd423adbfe1b</RequestId>
//   </ResponseMetadata>
// </DefineIndexFieldResponse>
CloudSearch.prototype.defineIndexField = function(domainName, fieldName, fieldType, opts) {
    var fieldParams = {},
        params = {
            'DomainName': domainName,
            'IndexFieldName': fieldName,
            'IndexFieldType': fieldType
        };
    opts = opts || {};

    if(fieldType === 'literal'){
        fieldParams['LiteralOptions.DefaultValue'] = opts.defaultValue || '';
        fieldParams['LiteralOptions.FacetEnabled'] = common.boolString(opts.facetEnabled);
        fieldParams['LiteralOptions.ResultEnabled'] = common.boolString(opts.resultEnabled);
        fieldParams['LiteralOptions.SearchEnabled'] = common.boolString(opts.searchEnabled);
    }
    else if(fieldType === 'uint'){
        fieldParams['UIntOptions.DefaultValue'] = opts.defaultValue || 0;
    }
    else if(fieldType === 'text'){
        fieldParams['TextOptions.DefaultValue'] = opts.defaultValue || '';
        fieldParams['TextOptions.FacetEnabled'] = common.boolString(opts.facetEnabled);
        fieldParams['TextOptions.ResultEnabled'] = common.boolString(opts.resultEnabled);
    }

    Object.keys(fieldParams).forEach(function(key){
    params['IndexField.'+key] = fieldParams[key];
    });

    return this.makeRequest(function(response){
        return response.defineIndexFieldResponse.defineIndexFieldResult.indexField;
    }, 'DefineIndexField', params, 'POST');
};

// <DescribeIndexFieldsResponse xmlns="http://cloudsearch.amazonaws.com/doc/2011-02-01">
//   <DescribeIndexFieldsResult>
//     <IndexFields>
//       <member>
//         <Status>
//           <CreationDate>2012-01-06T18:48:09Z</CreationDate>
//           <UpdateVersion>6</UpdateVersion>
//           <State>RequiresIndexDocuments</State>
//           <UpdateDate>2012-01-06T18:48:09Z</UpdateDate>
//         </Status>
//         <Options>
//           <IndexFieldType>text</IndexFieldType>
//           <IndexFieldName>test</IndexFieldName>
//           <TextOptions>
//             <FacetEnabled>false</FacetEnabled>
//             <ResultEnabled>true</ResultEnabled>
//             <DefaultValue/>
//           </TextOptions>
//         </Options>
//       </member>
//     </IndexFields>
//   </DescribeIndexFieldsResult>
//   <ResponseMetadata>
//     <RequestId>fb0d0643-3896-11e1-8af3-29b1183f687c</RequestId>
//   </ResponseMetadata>
// </DescribeIndexFieldsResponse>
CloudSearch.prototype.describeIndexFields = function(domainName){
    return this.makeRequest(function(response){
        return response.describeIndexFieldsResponse.describeIndexFieldsResult.indexFields;
    }, 'DescribeIndexFields', {'DomainName': domainName});
};

// Define a new rank expression for a domain.
//
// <DefineRankExpressionResponse xmlns="http://cloudsearch.amazonaws.com/doc/2011-02-01">
//   <DefineRankExpressionResult>
//     <RankExpression>
//       <Status>
//         <CreationDate>2012-01-06T20:49:49Z</CreationDate>
//         <UpdateVersion>8</UpdateVersion>
//         <State>Processing</State>
//         <UpdateDate>2012-01-06T20:49:49Z</UpdateDate>
//       </Status>
//       <Options>
//         <RankName>plain_text_relevance</RankName>
//         <RankExpression>text_relevance</RankExpression>
//       </Options>
//     </RankExpression>
//   </DefineRankExpressionResult>
//   <ResponseMetadata>
//     <RequestId>f98dd0d2-38a7-11e1-b274-bbde7eddd721</RequestId>
//   </ResponseMetadata>
// </DefineRankExpressionResponse>
CloudSearch.prototype.defineRankExpression = function(domainName, rankName, rankExpression){
    return this.makeRequest(function(response){
        return response.defineRankExpressionResponse.defineRankExpressionResult.rankExpression;
    }, 'DefineRankExpression', {'DomainName': domainName, 'RankName': rankName,
        'RankExpression': rankExpression});
};


// <DeleteRankExpressionResponse xmlns="http://cloudsearch.amazonaws.com/doc/2011-02-01">
//   <DeleteRankExpressionResult/>
//   <ResponseMetadata>
//     <RequestId>90716fd0-38a8-11e1-9d03-0d7236ac6cae</RequestId>
//   </ResponseMetadata>
// </DeleteRankExpressionResponse>
CloudSearch.prototype.deleteRankExpression = function(domainName, rankName){
    return this.makeRequest(function(response){return response;},
        'DeleteRankExpression', {'DomainName': domainName, 'RankName': rankName}, 'POST');
};

CloudSearch.prototype.describeDefaultSearchField = function(domainName){
    return this.makeRequest(function(response){return response;},
        'DescribeDefaultSearchField', {'DomainName': domainName});
};

CloudSearch.prototype.updateDefaultSearchField = function(domainName, fieldName){
    return this.makeRequest(function(response){return response;},
        'UpdateDefaultSearchField', {'DomainName': domainName,
            'DefaultSearchField': fieldName});
};

CloudSearch.prototype.describeServiceAccessPolicies = function(domainName){
    return this.makeRequest(function(response){
        return response.describeServiceAccessPoliciesResponse.describeServiceAccessPoliciesResult.accessPolicies;
    }, 'DescribeServiceAccessPolicies', {'DomainName': domainName});
};

CloudSearch.prototype.updateServiceAccessPolicies = function(domainName, policies){
    return this.makeRequest(function(response){return response;},
        'UpdateDefaultSearchField', {'DomainName': domainName,
            'AccessPolicies': policies});
};

CloudSearch.prototype.getDocumentClient = function(endpoint){
  return new DocumentClient(endpoint);
};

CloudSearch.prototype.getSearchClient = function(endpoint){
  return new SearchClient(endpoint);
};

module.exports.CloudSearch = CloudSearch;


// Reusable query object
function Query(args){
  this.defaults = {
      'q': null,
      'bq': null,
      'rank': [],
      'returnFields': [],
      'size': 10,
      'start': 0,
      'facet': [],
      'facetConstraints': [],
      'facetSort': {},
      'facetTopN': {},
      't': {}
  };

  Object.keys(this.defaults).forEach(function(key){
    this[key] = args[key] || this.defaults[key];
  }.bind(this));
}

Query.RESULTS_PER_PAGE = 500;

Query.prototype.updateSize = function(newSize) {
  this.size = newSize;
  this.realSize = (this.size > Query.RESULTS_PER_PAGE || this.size === 0) ?
    Query.RESULTS_PER_PAGE : this.size;
};

Query.prototype.toParams = function() {
  var params = {'start': this.start, 'size': this.realSize};
  if(this.q !== null){
    params.q = this.q;
  }

  if(this.bq !== null){
    params.bq = this.bq;
  }

  if(this.rank.length > 0){
    params.rank = this.rank.join(',');
  }

  if(this.returnFields.length > 0){
    params['return-fields'] = this.returnFields.join(',');
  }

  if(this.facet.length > 0){
    params.facet = this.facet.join(',');
  }

  if(this.facetConstraints !== null){
    Object.keys(this.facetConstraints).forEach(function(key){
      params['facet-'+key+'-constraints'] = this.facetConstraints[key];
    }.bind(this));
  }

  if(this.facetSort !== null){
    Object.keys(this.facetSort).forEach(function(key){
      params['facet-'+key+'-constraints'] = this.facetSort[key];
    }.bind(this));
  }

  if(this.facetTopN !== null){
    Object.keys(this.facetTopN).forEach(function(key){
      params['facet-'+key+'-constraints'] = this.facetTopN[key];
    }.bind(this));
  }

  if(this.t !== null){
    Object.keys(this.t).forEach(function(key){
      params['t-'+key] = this.t[key];
    }.bind(this));
  }
  return params;
};

function SearchResults(args){
  this.rid = args.info.rid;
  this.cpuTimeMs = args.info['cpu-time-info'];
  this.timeMs = args.info['time-ms'];
  this.hits = args.hits.found;
  this.docs = args.hits.hit;
  this.start = args.hits.start;
  this.rank = args.hits.rank;
  this.matchExpression = args['match-expr'];
  this.query = args.query;
  this.searchService = args.searchService;

  this.length = this.docs.length;
  this.numPagesNeeded = Math.ceil(this.hits/this.query.realSize);
}

SearchResults.prototype.getNextPage = function() {
  // @todo (lucas) see if we actually need this.
};

function SearchClient(endpoint){
  this.endpoint = endpoint;
}

SearchClient.prototype.search = function(args) {
  this.query = new Query(args);

  var d = when.defer(), options, request, hasError;
  options = {
    'host': this.endpoint,
    'port': 80,
    'method': 'GET',
    'path': '/2011-02-01/search?'+querystring.stringify(this.query.toParams())
  };

  request = http.request(options, function(res){
    var response = '';
    res.on('data', function(data){
      response += data;
    });
    res.on('end', function(){
      var data = JSON.parse(response);
      data.query = this.query;
      data.searchService = this;

      if(data.hasOwnProperty('messages') && data.hasOwnProperty('error')){
        data.messages.forEach(function(message){
          if(message.severity === 'fatal'){
            hasError = new Error("Error processing search: "+message.message+" "+this.query);
            return false;
          }
        }.bind(this));
      }

      if(hasError){
        d.reject(hasError);
      }
      else{
        d.resolve(new SearchResults(data));
      }

    }.bind(this));
    res.on('error', function(e){
      d.reject(e);
    }.bind(this));

  }.bind(this));
  request.end();
  return d.promise;
};

module.exports.getSearchClient = function(endpoint){
  return new SearchClient(endpoint);
};


function DocumentClient(endpoint){
  this.documentsBatch = [];
  this.sdf = null;
}

DocumentClient.prototype.add = function(id, version, fields){
  var doc = {'type': 'add', 'id': id, 'version': version,
    'fields': fields, 'lang': 'en'};

  this.documentsBatch.push(doc);
  return doc;
};

DocumentClient.prototype.remove = function(id, version) {
  var doc =  {'type': 'delete', 'id':id, 'version': version};
  this.documentsBatch.push(doc);
  return doc;
};

DocumentClient.prototype.getSDF = function() {
  return (this.sdf !== null) ? this.sdf : JSON.stringify(this.documentsBatch);
};

DocumentClient.prototype.addFromS3 = function(keyObject) {
  // @todo (lucas) Reimpliment.
  // """@todo (lucas) would be nice if this could just take an s3://uri..."""
  // self._sdf = key_obj.get_contents_as_string()
};

DocumentClient.prototype.clearSDF = function() {
  this.sdf = null;
  this.documentsBatch = [];
};

DocumentClient.prototype.commit = function() {
  var sdf = this.getSDF(),
    d = when.defer(), nullIndex, options, request;

  nullIndex = sdf.indexOf(': null');
  if(nullIndex > -1){
    process.onNextTick(function(){
      d.reject(new Error('null in SDF detected. '+
        (sdf.slice(nullIndex-100, nullIndex+100))));
    });
  }
  else{
    options = {
      'host': this.endpoint,
      'port': 80,
      'method': 'POST',
      'path': '/2011-02-01/documents/batch'
    };

    request = http.request(options, function(res){
      var response = '';
      res.on('data', function(data){
        response += data;
      });
      res.on('end', function(){
        d.resolve(JSON.parse(response));
      }.bind(this));
      res.on('error', function(e){
        d.reject(e);
      }.bind(this));
    }.bind(this));
  }
  return d.promise;
};

module.exports.getDocumentClient = function(endpoint){
  return new DocumentClient(endpoint);
};

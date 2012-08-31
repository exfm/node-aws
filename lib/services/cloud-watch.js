"use strict";

var util = require('util'),
    Connection = require('../aws').Connection,
    extend = require('whet.extend');

function CloudWatch(accessKeyId, secretAccessKey){
    CloudWatch.super_.call(this, accessKeyId, secretAccessKey,
        'monitoring.us-east-1.amazonaws.com', '2010-08-01');
}

CloudWatch.prototype.deleteAlarms = function(names){
    var params = {};

    names.forEach(function(name, index){
        params['AlarmNames.member.' + (index + 1)] = name;
    });

    return this.makeRequest(function(response){
        return response;
    }, 'DeleteAlarams', params);
};

CloudWatch.prototype.describeAlarmHistory = function(name, opts){
    var params = {
        'AlarmName': name
    };

    return this.makeRequest(function(response){
        return response;
    }, 'DescribeAlarmHistory', params);
};


// Options:
// * actionPrefix - The action name prefix.
// * namePrefix - The alarm name prefix.
// * names
// * max
// * token
// * state
CloudWatch.prototype.describeAlarms = function(opts){
    opts = opts || {};
    var params = {};

    if(opts.actionPrefix){
        params.ActionPrefix = opts.actionPrefix;
    }

    if(opts.namePrefix){
        params.AlarmNamePrefix = opts.namePrefix;
    }

    if(opts.names){
        opts.names.forEach(function(name, index){
            params['AlarmNames.member.' + (index + 1)] = name;
        });
    }

    if(opts.max){
        params.MaxRecords = opts.max;
    }

    if(opts.token){
        params.NextToken = opts.token;
    }

    if(opts.state){
        params.StateValue = opts.state;
    }

    return this.makeRequest(function(response){
        return response;
    }, 'DescribeAlarms', params);
};


// Options:
// * dimensions: {key, value}
// * statistic: SampleCount | Average | Sum | Minimum | Maximum
// * unit: Seconds | Microseconds | Milliseconds | Bytes | Kilobytes |
//      Megabytes | Gigabytes | Terabytes | Bits | Kilobits | Megabits | Gigabits |
//      Terabits | Percent | Count | Bytes/Second | Kilobytes/Second |
//      Megabytes/Second | Gigabytes/Second | Terabytes/Second | Bits/Second |
//      Kilobits/Second | Megabits/Second | Gigabits/Second | Terabits/Second |
//      Count/Second | None
// * period: The period in seconds over which the statistic is applied.
CloudWatch.prototype.describeAlarmsForMetric = function(namespace, name, opts){
    opts = opts || {};
    var params = {
        'Namespace': namespace,
        'MetricName': name
    };

    if(opts.statistic){
        params.Statistic = opts.statistic;
    }

    if(opts.unit){
        params.Unit = opts.unit;
    }

    if(opts.period){
        params.Period = opts.period;
    }

    if(opts.dimenions){
        Object.keys(opts.dimensions).forEach(function(key, index){
            params['Dimensions.member.' + (index + 1) + '.Name'] = key;
            params['Dimensions.member.' + (index + 1) + '.Value'] = opts.dimensions[key];
        });
    }
    return this.makeRequest(function(response){
        return response;
    }, 'DescribeAlarmsForMetric', params);
};

CloudWatch.prototype.disableAlaramActions = function(names){
    var params = {};

    names.forEach(function(name, index){
        params['AlarmNames.member.' + (index + 1)] = name;
    });

    return this.makeRequest(function(response){
        return response;
    }, 'DisableAlarmActions', params);
};

CloudWatch.prototype.enableAlarmActions = function(names){
    var params = {
        'AlarmNames':{
            'member': {}
        }
    };

    names.forEach(function(name, index){
        params['AlarmNames.member.' + (index + 1)] = name;
    });

    return this.makeRequest(function(response){
        return response;
    }, 'EnableAlarmActions', params);
};

// * statistics: array.  Average | Sum | SampleCount | Maximum | Minimum
CloudWatch.prototype.getMetricStatistics = function(namespace, name, period,
    startTime, endTime, statistics, unit, dimensions){

    var params = {
        'Namespace': namespace,
        'MetricName': name,
        'Period': period,
        'StartTime': startTime,
        'EndTime': endTime,
        'Unit': unit
    };

    Object.keys(statistics).forEach(function(key, index){
        params['Statistics.member.' + (index + 1)] = key;
    });

    if(dimensions){
        Object.keys(dimensions).forEach(function(key, index){
            params['Dimensions.member.' + (index + 1) + '.Name'] = key;
            params['Dimensions.member.' + (index + 1) + '.Value'] = dimensions[key];
        });
    }

    return this.makeRequest(function(response){
        return response;
    }, 'GetMetricStatistics', params);
};

CloudWatch.prototype.listMetrics = function(opts){
    opts = opts || {};
    var params = {};

    if(opts.namespace){
        params.Namespace = opts.namespace;
    }

    if(opts.name){
        params.MetricName = opts.name;
    }

    if(opts.token){
        params.NextToken = opts.token;
    }

    if(opts.dimensions){
        Object.keys(opts.dimensions).forEach(function(key, index){
            params['Dimensions.member.' + (index + 1) + '.Name'] = key;
            params['Dimensions.member.' + (index + 1) + '.Value'] = opts.dimensions[key];
        });
    }

    return this.makeRequest(function(response){
        return response;
    }, 'ListMetrics', params);

};


var operatorStrings = [
    'GreaterThanOrEqualToThreshold',
    'GreaterThanThreshold',
    'LessThanThreshold',
    'LessThanOrEqualToThreshold'
];

var operatorShortHand = [
    '>=',
    '>',
    '<',
    '<='
];

CloudWatch.prototype.putMetricAlarm = function(namespace, metricName, alarmName,
    comparisonOperator, evaluationPeriod, period, statistic, threshold, opts){

    var params = {
        'Namespace': namespace,
        'MetricName': metricName,
        'AlarmName': alarmName,
        'EvaluationPeriod': evaluationPeriod,
        'Period': period,
        'Statistic': statistic,
        'Threshold': threshold
    };

    if(operatorStrings.indexOf(comparisonOperator) === -1){
        comparisonOperator = operatorStrings[operatorShortHand.indexOf(comparisonOperator)];
    }
    params.ComparisonOperator = comparisonOperator;

    if(opts.actionsEnabled){
        params.ActionsEnabled = opts.actionsEnabled;
    }

    if(opts.alarmActions){
        opts.alaramActions.forEach(function(action, index){
            params['AlaramActions.member.' + (index + 1)] = action;
        });
    }

    if(opts.alarmDescription){
        params.AlarmDescription = opts.alarmDescription;
    }

    if(opts.dimensions){
        Object.keys(opts.dimensions).forEach(function(key, index){
            params['Dimensions.member.' + (index + 1) + '.Name'] = key;
            params['Dimensions.member.' + (index + 1) + '.Value'] = opts.dimensions[key];
        });
    }

    if(opts.insufficientDataActions){
        opts.insufficientDataActions.forEach(function(action, index){
            params['InsufficientDataActions.member.' + (index + 1)] = action;
        });
    }

    if(opts.okActions){
        opts.okActions.forEach(function(action, index){
            params['OKActions.member.' + (index + 1)] = action;
        });
    }

    if(opts.unit){
        params.Unit = opts.unit;
    }

    return this.makeRequest(function(response){
        return response;
    }, 'PutMetricAlarm', params);
};

CloudWatch.prototype.putMetricData = function(namespace, data){
    var params = {
        'Namespace': namespace
    }, base;

    data.forEach(function(item, index){
        base = 'MetricData.member.' + (index + 1);
        params[base + '.MetricName'] = item.name;
        params[base + '.Value'] = item.value;
        params[base + '.Unit'] = item.unit;
        params[base + '.Timestamp'] = item.timestamp;
        params[base + '.StatisticValues.Maximum'] = item.max;
        params[base + '.StatisticValues.Minimum'] = item.min;
        params[base + '.StatisticValues.SampleCount'] = item.samples;
        params[base + '.StatisticValues.Sum'] = item.sum;
        Object.keys(item.dimensions).forEach(function(key, index){
            params[base + '.Dimensions.member.' + (index + 1) + '.Name'] = key;
            params[base + '.Dimensions.member.' + (index + 1) + '.Value'] = item.dimensions[key];
        });
    });

    return this.makeRequest(function(response){
        return response;
    }, 'PutMetricData', params);
};

CloudWatch.prototype.setAlarmState = function(name, reason, value, reasonData){
    var params = {
        'AlaramName': name,
        'StateReason': reason,
        'StateValue': value
    };

    if(reasonData){
        params.StateReasonData = JSON.stringify(reasonData);
    }

    return this.makeRequest(function(response){
        return response;
    }, 'SetAlarmState', params);
};

module.exports = CloudWatch;
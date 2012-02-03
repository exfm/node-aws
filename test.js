#!/usr/local/bin/node

var fs      = require('fs');
var util    = require('util');
var assert  = require('assert');
var events  = require('events');
var promise = require('./lib/promise');

/**
 * Searches the given directory for modules and invokes all Functions
 * that are present in a "tests" hash.
 *
 * @param   String    baseDir
 * @return  Promise
 */
var runTests = function(baseDir) {
  var self        = this;
  var waiting     = 0;
  var testModules = {};
  var listener    = new events.EventEmitter();
  var result      = promise.create();
  var stats       = {
    found: 0,
    passed: 0,
    failed: 0,
  }

  listener.on('wait', function() {
    waiting++;
  });

  listener.on('resolve', function() {
    waiting--;

    if (0 === waiting) {
      var results = {
        stats: {
          passed: 0,
          failed: 0,
        },
        tests: {},
      };

      Object.keys(testModules).forEach(function(testModuleName) {
        var testModule = testModules[testModuleName];

        results.tests[testModuleName] = {};

        Object.keys(testModule.tests).forEach(function(testName) {
          results.tests[testModuleName][testName] = testModule.tests[testName].result;

          if (true === testModule.tests[testName].result) {
            results.stats.passed++;
          } else {
            results.stats.failed++;
          }
        });
      });

      results.stats.total = results.stats.passed + results.stats.failed;

      result.succeed(results);
    }
  });

  listener.on('testModuleFound', function(filePath, testModule) {
    testModules[filePath] = testModule;

    runTestModule(testModule);
  });

  listener.on('testComplete', function(test) {
    result.progress();
  });

  /**
   * Recursively finds all test modules in the given directory.
   *
   * @param   String  dir
   */
  var findTestSuites = function(dir) {
    listener.emit('wait');

    fs.readdir(dir, function(e, fileNames) {
      if (e) {
        return;
      }

      fileNames.forEach(function(fileName) {
        var filePath  = dir + '/' + fileName;

        listener.emit('wait');

        fs.stat(filePath, function(e, fileStats) {
          if (fileStats.isDirectory()) {
            findTestSuites(filePath);
          } else if (fileStats.isFile()) {
            try {
              var testModule = require(filePath);

              if (testModule.tests && 0 < Object.keys(testModule.tests).length) {
                listener.emit('testModuleFound', filePath, testModule);
              }
            } catch (e) {
              // ignore
            }
          }

          listener.emit('resolve');
        });
      });

      listener.emit('resolve');
    });
  };

  /**
   * Runs all of the tests in the given module.
   *
   * @param   Object  testModule
   */
  var runTestModule = function(testModule) {
    Object.keys(testModule.tests).forEach(function(testName) {
      var test = testModule.tests[testName];

      if ('function' === typeof test) {
        if ('function' === typeof testModule.setUp) {
          testModule.setUp();
        }

        try {
          test();

          test.result = true;
        } catch (e) {
          test.result = e;
        }

        if ('function' === typeof testModule.tearDown) {
          testModule.tearDown();
        }

        listener.emit('testComplete', test);
      }
    });
  };

  baseDir = fs.realpathSync(baseDir);

  findTestSuites(baseDir);

  return result;
};

process.stdout.write('\n\033[1mRUNNING...\033[0m\n\n');

runTests(__dirname + '/test').onProgress(function() {
}).onSuccess(function() {
  var result = this;

  process.stdout.write('\033[1mRESULTS\033[0m\n\n');

  process.stdout.write('  Total: ' + result.stats.total + '\n');
  process.stdout.write('  Passed: ' + result.stats.passed + '\n');
  process.stdout.write('  Failed: ' + result.stats.failed + '\n');

  if (0 < result.stats.failed) {
    process.stdout.write('\n\033[1mFAILED TESTS\033[0m\n');

    Object.keys(result.tests).forEach(function(testModuleName) {
      var tests   = result.tests[testModuleName];
      var errors  = {};

      Object.keys(tests).forEach(function(testName) {
        if (true !== tests[testName]) {
          errors[testName] = tests[testName];
        }
      });

      if (0 < Object.keys(errors).length) {
        process.stdout.write('\n  \033[1m' + testModuleName + '\033[0m');

        Object.keys(errors).forEach(function(testName) {
          process.stdout.write('\n    ' + testName + ':');
          process.stdout.write('\n      ' + errors[testName].stack.replace(/\n\s+/mg, '\n        ') + '\n');
        });
      }
    });
  }

  process.stdout.write('\n');
});
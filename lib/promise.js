/**
 *
 */
var Promise = function() {
  var self              = this;
  var result            = null;
  var successHandlers   = [];
  var failureHandlers   = [];
  var progressHandlers  = [];
  var context           = [];

  self.succeed = function(obj) {
    if (null !== result) {
      throw new Error('already resolved');
    }

    result  = true;
    context = obj;

    successHandlers.forEach(function(callback) {
      callback.call(context);
    });

    return self;
  };

  self.fail = function(obj) {
    if (null !== result) {
      throw new Error('already resolved');
    }

    result  = false;
    context = obj;

    failureHandlers.forEach(function(callback) {
      callback.call(context);
    });

    return self;
  };

  self.progress = function(obj) {
    if (null !== result) {
      throw new Error('already resolved');
    }

    progressHandlers.forEach(function(callback) {
      callback.call(obj);
    });

    return self;
  };

  self.onSuccess = function(callback) {
    successHandlers.push(callback);

    if (true === result) {
      callback.call(context);
    }

    return self;
  }

  self.onFailure = function(callback) {
    failureHandlers.push(callback);

    if (false === result) {
      callback.call(context);
    }

    return self;
  };

  self.onProgress = function(callback) {
    progressHandlers.push(callback);

    return self;
  }

  self.then = function(onSuccess, onFailure, onProgress) {
    if (onSuccess) {
      self.onSuccess(onSuccess);
    }

    if (onFailure) {
      self.onFailure(onFailure);
    }

    if (onProgress) {
      self.onProgress(onProgress);
    }

    return self;
  };
};

module.exports.create = function() {
  return new Promise();
}
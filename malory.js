var malory;

malory = function(config) {
  var budgetedWorkers, initialize, initializeWorker, machinations, sendMessage, workers;
  machinations = {};
  workers = {};
  budgetedWorkers = 50;
  sendMessage = function(worker, message, workerName) {
    return new Promise(function(resolve, reject) {
      var listen;
      listen = function(e) {
        if (e.data.demand === message.demand) {
          e.currentTarget.removeEventListener("message", listen);
          if (workerName != null) {
            e.data.workerName = workerName;
          }
          return resolve(e.data);
        }
      };
      worker.addEventListener("message", listen);
      return worker.postMessage(message);
    });
  };
  initializeWorker = function(configEntry) {
    var message, worker;
    worker = new Worker(configEntry.workerUrl);
    workers[configEntry.name + '-' + configEntry.counter] = worker;
    message = {
      counter: configEntry.counter,
      demand: configEntry.initialDemand,
      workerArguments: configEntry.workerArguments
    };
    return sendMessage(worker, message).then(function(data) {
      if (data[configEntry.officiallyOutOfMemory]) {
        configEntry.counter++;
        configEntry.workerArguments = data.workerArguments;
        if (!(configEntry.counter >= configEntry.budgetedWorkers)) {
          return initializeWorker(configEntry);
        }
      }
    });
  };
  initialize = function(config) {
    var configEntry, i, _i, _len, _results;
    _results = [];
    for (i = _i = 0, _len = config.length; _i < _len; i = ++_i) {
      configEntry = config[i];
      if (!configEntry.name) {
        configEntry.name = i;
      }
      if (!configEntry.budgetedWorkers) {
        configEntry.budgetedWorkers = budgetedWorkers;
      }
      configEntry.counter = 0;
      _results.push(initializeWorker(configEntry));
    }
    return _results;
  };
  machinations.demand = function(demand, workerArguments, names) {
    var key, message, promiseArray, worker, workerName;
    promiseArray = [];
    if (names == null) {
      names = [];
    }
    for (key in workers) {
      worker = workers[key];
      workerName = key.split('-')[0];
      if (!(names.length > 0 && names.indexOf(workerName) === -1)) {
        message = {
          demand: demand,
          workerArguments: workerArguments
        };
        promiseArray.push(sendMessage(worker, message, workerName));
      }
    }
    return Promise.all(promiseArray);
  };
  machinations.killAllWorkers = function() {
    var key, worker, _results;
    _results = [];
    for (key in workers) {
      worker = workers[key];
      _results.push(worker.terminate());
    }
    return _results;
  };
  initialize(config);
  return machinations;
};

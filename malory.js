var malory;

malory = function(config) {
  var budgetedWorkers, initialize, initializeWorker, machinations, sendMessage, workers;
  machinations = {};
  workers = {};
  budgetedWorkers = 50;
  sendMessage = function(worker, message) {
    return new Promise(function(resolve, reject) {
      var listen;
      listen = function(e) {
        if (e.data.demand === message.demand) {
          e.currentTarget.removeEventListener("message", listen);
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
  machinations.demand = function(demand, workerArguments) {
    var key, message, promiseArray, worker;
    promiseArray = [];
    for (key in workers) {
      worker = workers[key];
      message = {
        demand: demand,
        workerArguments: workerArguments
      };
      promiseArray.push(sendMessage(worker, message));
    }
    return Promise.all(promiseArray);
  };
  initialize(config);
  return machinations;
};

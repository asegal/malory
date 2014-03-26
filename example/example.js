var demand, maloryInstance, workerArguments, workerConfig;

workerConfig = [
  {
    workerUrl: "employee.js",
    name: "hrEmployee",
    initialDemand: "initialize worker",
    budgetedWorkers: 10,
    officiallyOutOfMemory: "we are officially out of memory",
    workerArguments: {
      'memoryLimit': 700 * 1024
    }
  }, {
    workerUrl: "employee.js",
    name: "fieldEmployee",
    initialDemand: "initialize worker",
    budgetedWorkers: 10,
    officiallyOutOfMemory: "we are officially out of memory",
    workerArguments: {
      'memoryLimit': 700 * 1024
    }
  }
];

maloryInstance = new malory(workerConfig);

demand = 'bring me a gin and tonic';

workerArguments = {
  'ginBrand': 'tanqueray'
};

maloryInstance.demand(demand, workerArguments).then(function(drinkArray) {
  var drink, i, _i, _len, _results;
  _results = [];
  for (i = _i = 0, _len = drinkArray.length; _i < _len; i = ++_i) {
    drink = drinkArray[i];
    _results.push(console.log('I am having gin and tonic number ' + i));
  }
  return _results;
});

module('demand', {
  setup: function () {
    var config = [
      {
        workerUrl: "worker.js",
        workerArguments: {'index':'notOOM'},
        initialDemand: "loadIndex",
        budgetedWorkers: 7,
        officiallyOutOfMemory: "officiallyOutOfMemory"
      },{
        workerUrl: "worker.js",
        workerArguments: {'index':'OOM'},
        initialDemand: "loadIndex",
        budgetedWorkers: 5,
        officiallyOutOfMemory: "officiallyOutOfMemory"
      }
    ]
    malory(config).then(function(machinations){
      this.isisCeo = machinations;
    });
  }
})


asyncTest('sending a demand', function () {
  expect( 7 );
  var demand='gin';
  var callbackData = [];

  checkData = function() {
    start()
    equal(callbackData.length,6)
    for ( i=0; i < 6; i++) {
      equal(callbackData[i].demand, demand);
    }
  }
  doDemand = function () {
    this.isisCeo.demand(demand).then(function(data) {
      callbackData = data;
      checkData();
    })
  }
  setTimeout(doDemand,500) 

});

asyncTest('killing workers', function () {
  expect( 1 );
  var demand='gin';
  var callbackCalled = false;

  checkData = function() {
    start()
    equal(callbackCalled, false)
  }
  doKillAllWorkers = function () {
    this.isisCeo.killAllWorkers()
    isisCeo.demand(demand).then(function(data) {
      callbackCalled = true;
    })
    checkData();
  }
  setTimeout(doKillAllWorkers,500) 

});

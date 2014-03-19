module('demand', {
  setup: function () {
    var config = [
      {
        workerUrl: "../example/worker.js",
        workerArguments: {'index':'notOOM'},
        initialDemand: "loadIndex",
        budgetedWorkers: 7,
        officiallyOutOfMemory: "officiallyOutOfMemory"
      },{
        workerUrl: "../example/worker.js",
        workerArguments: {'index':'OOM'},
        initialDemand: "loadIndex",
        budgetedWorkers: 5,
        officiallyOutOfMemory: "officiallyOutOfMemory"
      }
    ]
  this.isisCeo = new malory(config)
  }
})

asyncTest('sending a demand', function () {
  expect( 7 );
  var demand='gin';
  var callbackData = [];
  var isisCeo = this.isisCeo;

  checkData = function() {
    start()
    equal(callbackData.length,6)
    for ( i=0; i < 6; i++) {
      equal(callbackData[i].demand, demand);
    }
  }
  doDemand = function () {
    isisCeo.demand(demand).then(function(data) {
      callbackData = data;
      checkData();
    })
  }
  setTimeout(doDemand,100) 

});

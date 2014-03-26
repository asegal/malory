workerConfig = [
  {
    workerUrl: "employee.js"
    name: "hrEmployee"
    initialDemand: "initialize worker"
    budgetedWorkers: 10
    officiallyOutOfMemory: "we are officially out of memory"
    workerArguments: {'memoryLimit': 700*1024 }
  },{
    workerUrl: "employee.js"
    name: "fieldEmployee"
    initialDemand: "initialize worker"
    budgetedWorkers: 10
    officiallyOutOfMemory: "we are officially out of memory"
    workerArguments: {'memoryLimit': 700*1024 }
  }
]

maloryInstance = new malory workerConfig

demand = 'bring me a gin and tonic'
workerArguments = {'ginBrand':'tanqueray'}
maloryInstance.demand(demand, workerArguments).then (drinkArray) ->
  for drink, i in drinkArray
    console.log 'I am having gin and tonic number ' + i

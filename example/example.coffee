isisCeo = undefined
config = [
  {
    workerUrl: "worker.js"
    initialDemand: "getCms"
    workerArguments: index: "myCms.json"
    budgetedWorkers: 50
    officiallyOutOfMemory: "officiallyOutOfMemory"
  }
  {
    workerUrl: "worker.js"
    initialDemand: "getLeads"
    workerArguments: index: "myLeads.json"
    budgetedWorkers: 50
    officiallyOutOfMemory: "officiallyOutOfMemory"
  }
]

isisCeo = new malory(config)
isisCeo.demand('gin').then (data) ->
  for datum in data
    console.log '... and freshly squeezed limes'

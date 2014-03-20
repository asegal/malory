malory
======
malory is a web worker manager
* it's a function which returns an object
* instantiates Worker's based on client config settings
* returns an object from which a client is able to send a message(aka demand) to all workers
* on demand, a Promise is returned which when Resolve'd will return an array containing each workers response to the demand

Example:
```coffee
config = [
  {
    workerUrl: "worker.js"
    initialDemand: "getCms"
    workerArguments: index: "myCms.json"
    budgetedWorkers: 50
    officiallyOutOfMemory: "officiallyOutOfMemory"
  }
]

isisCeo = new malory(config)
```

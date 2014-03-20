# malory 
malory functions as a web worker manager
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

### malory is a function...

    malory = (config) ->
      # Private
      machinations = {}
      workers = {}
      budgetedWorkers = 50

##### sendMessage
sendMessage is a private function that manages communication between malory and a worker

      sendMessage = (worker, message) ->
        new Promise (resolve, reject) ->
          listen = (e) ->
            if (e.data.demand == message.demand)
              e.currentTarget.removeEventListener("message", listen)
              resolve e.data
          worker.addEventListener("message", listen)
          worker.postMessage(message)

##### initializeWorker
initializeWorker is a private function that instantiates a web worker and handles the initialDemand. Bounded by budgetedWorkers a subsequent new worker will be instantiated if the original worker is officially out of memory

      initializeWorker = (configEntry) ->
        worker = new Worker(configEntry.workerUrl)
        workers[configEntry.name + '-' + configEntry.counter] = worker
        message =
          counter: configEntry.counter
          demand: configEntry.initialDemand
          workerArguments: configEntry.workerArguments
        sendMessage(worker, message).then (data) ->
          if data[configEntry.officiallyOutOfMemory]
            configEntry.counter++
            configEntry.workerArguments = data.workerArguments
            initializeWorker(configEntry) unless configEntry.counter >= configEntry.budgetedWorkers
      
##### initialize
initialize is a private function which will parse the config array for configEntry object(s) and call initializeWorker with a configEntry object

      initialize = (config) ->
        for configEntry, i in config
          configEntry.name = i unless configEntry.name
          configEntry.budgetedWorkers = budgetedWorkers unless configEntry.budgetedWorkers
          configEntry.counter = 0
          initializeWorker configEntry

##### machinations.demand
machinations are public and returned to the client
machinations.demand is a function that returns a Promise. Internally, sendMessage will post a message to all of malory's workers from which the workers will Resolve or Reject.

      machinations.demand = (demand, workerArguments) ->
        promiseArray = []
        for key, worker of workers
          message =
            demand: demand
            workerArguments: workerArguments
          promiseArray.push sendMessage(worker,message)
        Promise.all(promiseArray)

##### call initialize with the passed in config
nuff said

      initialize config

### ...which returns machinations from which demand is exposed to the client

      return machinations

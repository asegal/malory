# malory 
malory functions as a web worker manager
* instantiates Worker based on config settings
* returns an object from which a client is able to send a message(aka demand) to all workers
* on demand, a promise is returned which when reolved will return an array containing each workers response to the demand

### malory is a function
pass a config item
object = new malory(config)

    malory = (config) ->
      # Private
      machinations = {}
      workers = {}
      budgetedWorkers = 50

## sendMessage

      sendMessage = (worker, message) ->
        new Promise (resolve, reject) ->
          listen = (e) ->
            if (e.data.demand == message.demand)
              e.currentTarget.removeEventListener("message", listen)
              resolve e.data
          worker.addEventListener("message", listen)
          worker.postMessage(message)

## initializeWorker

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
      
## initialize

      initialize = (config) ->
        for configEntry, i in config
          configEntry.name = i unless configEntry.name
          configEntry.budgetedWorkers = budgetedWorkers unless configEntry.budgetedWorkers
          configEntry.counter = 0
          initializeWorker configEntry

## machinations

      machinations.demand = (demand, workerArguments) ->
        promiseArray = []
        for key, worker of workers
          message =
            demand: demand
            workerArguments: workerArguments
          promiseArray.push sendMessage(worker,message)
        Promise.all(promiseArray)

## do the initialize with the config

      initialize config

### which returns machinations from which demand is exposed to the client

      return machinations

malory = (config) ->
  # Private
  machinations = {}
  workers = {}
  budgetedWorkers = 10

  sendMessage = (worker, message) ->
    new Promise (resolve, reject) ->
      worker.addEventListener 'message', (e) ->
        if (e.data.demand == message.demand)
          worker.removeEventListener('message', this)
          resolve e.data
      worker.postMessage(message)
  
  initializeWorker = (configEntry) ->
    worker = new Worker(configEntry.workerUrl)
    workers[configEntry.name + '-' + configEntry.counter] = worker
    message =
      demand: configEntry.initialDemand
      workerArguments: configEntry.workerArguments
    sendMessage(worker, message).then (data) ->
      if data[configEntry.officiallyOutOfMemory]
        configEntry.counter++
        configEntry.workerArguments = data.workerArguments
        initializeWorker(configEntry) unless configEntry.counter > configEntry.budgetedWorkers
  
  initialize = (config) ->
    for configEntry, i in config
      configEntry.name = i unless configEntry.name
      configEntry.budgetedWorkers = budgetedWorkers unless configEntry.budgetedWorkers
      configEntry.counter = 0
      initializeWorker configEntry
  
  # Send message to all workers, returns a promise, which will return an array containg each workers response as the index values
  machinations.demand = (demand, workerArguments) ->
    promiseArray = []
    Object.keys(workers).forEach (worker) ->
      message =
        demand: demand
        workerArguments: workerArguments
      promiseArray.push sendMessage(worker,message)
    Promise.all(promiseArray)
  
  initialize config
  
  return machinations

# malory 
malory is a __web worker manager__ which handles instantiation, messaging, and destruction of a collection of web workers.

### malory is a function...

    ((global) ->

      isNode = module?.exports?

      malory = (config) ->

### ...with the following member variables and objects...

##### machinations (public, returned)
An object returned after calling the malory function, which contains all the public methods of the library and has access to the private members of the malory constructor closure.

        machinations = {}

##### workers (private)
An object which contains references to all workers which malory currently manages.  This object will use the 'name' property passed in the config element as part of the key (i.e. name_0, name_1, etc.).  If a name property is not passed for a particular config element, malory will use the config element's index in lieu of the name property (i.e 0_1, 0_2, etc.)

        workers = {}

##### budgetedWorkers (private)
A limit on the number of workers a particular config element can spawn.  This value can be overridden by setting the 'budgetedWorkers' property on a config element.

        budgetedWorkers = 50

### ...and the following methods...

##### sendMessage (private)
A private function which manages communication between malory and a worker

        sendMessage = (worker, message) ->
          new Promise (resolve, reject) ->
            if isNode
              listen = (m) ->
                if (m.demand == message.demand)
                  worker.removeListener("message", listen)
                  resolve m
              worker.on 'message', listen
              worker.send message
            else
              listen = (e) ->
                if (e.data.demand == message.demand)
                  e.currentTarget.removeEventListener("message", listen)
                  resolve e.data
              worker.addEventListener("message", listen)
              worker.postMessage(message)

##### initializeWorker (private)
A private function which instantiates a web worker and handles the initialDemand. At the resolution of the initial demand promise, the user-specified 'officiallyOutOfMemory' return message property is checked.  If true, a subsequent worker is initialized with the same demand as the previous worker, but with the message having

1. The counter property incremented by 1
2. The workerArguments property assigned the value of the previous worker's __returned__ workerArguments property (allowing workers to thread initialization data through malory)

A subsequent worker will not be initialized if the number of current workers spawned from a particular config element is greater than the budgetedWorkers property (if omitted from the config, this value is set by malory).

        initializeWorker = (configEntry) ->
          if isNode  #node - fork child process
            worker = fork configEntry.workerUrl
            worker.setMaxListeners 0 #unlimited listeners, default is otherwise 8
          else #browser - create web worker
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
      
##### initialize (private)
A private function which will parse the config array and call initializeWorker on each element in the config array

        initialize = (config) ->
          for configEntry, i in config
            configEntry.name = i unless configEntry.name
            configEntry.budgetedWorkers = budgetedWorkers unless configEntry.budgetedWorkers
            configEntry.counter = 0
            initializeWorker configEntry

##### machinations.demand (public)
A function which returns a Promise. Internally, sendMessage will post a message to all of malory's workers and Resolve the demand.

        machinations.demand = (demand, workerArguments) ->
          promiseArray = []
          for key, worker of workers
            message =
              demand: demand
              workerArguments: workerArguments
            promiseArray.push sendMessage(worker,message)
          Promise.all(promiseArray)

##### machinations.killAllWorkers (public)
A function which immediately terminates all workers.

        machinations.killAllWorkers = () ->
          for key, worker of workers
            if isNode
              worker.kil()
            else
              worker.terminate()

##### initialize call (private, first method called)
The initial method called at malory instantiation

        initialize config

### ...which returns a machinations object exposing the public API methods

        return machinations

### malory can be used in the browser, or as a node.js module

      global.malory = malory

    )(this)

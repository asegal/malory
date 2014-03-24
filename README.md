malory
======
malory is a __web worker manager__ which handles instantiation, messaging, and destruction of a collection of web workers.

### Public API

##### Constructor
```coffee
maloryInstance = new malory(config)
```

##### malory.demand
```coffee
    maloryInstance.demand(demand, workerArguments).then (responseArray) ->
      # Iterate over the response array, perhaps coalescing the results
```

##### malory.killAllWorkers
```coffee
maloryInstance.killAllWorkers()
```


### Example

##### Main Thread

```coffee
workerConfig = [
  {
    workerUrl: "scripts/employee.js"
    name: "hrEmployee"
    initialDemand: "initialize worker"
    budgetedWorkers: 10
    officiallyOutOfMemory: "we are officially out of memory"
    workerArguments: {'memoryLimit': 700*1024 }
  },{
    workerUrl: "scripts/employee.js"
    name: "fieldEmployee"
    initialDemand: "initialize worker"
    budgetedWorkers: 10
    officiallyOutOfMemory: "we are officially out of memory"
    workerArguments: {'memoryLimit': 700*1024 }
  }
]

maloryInstance = new malory(config)

demand = 'bring me a gin and tonic'
workerArguments = {'ginBrand':'tanqueray'}
maloryInstance.demand(demand, workerArguments).then (drinkArray) ->
  for drink, i in drinkArray
    console.log 'I am having gin and tonic number ' + i
```

##### employee.js (the web worker)

```coffee
self.addEventListener "message", ((e) ->
  
  # Extract Arguments
  demand = e.data.demand
  counter = e.data.counter
  workerArguments = e.data.workerArguments
  memoryLimit = workerArguments.memoryLimit

  # Decide Which Course of Action to Take
  itemFetched = ''
  switch demand
    when 'bring me a gin and tonic' then itemFetched = 'gin and tonic'
    when 'bring me a monte cristo sandwich' then itemFetched = 'monte cristo'

  # Respond to malory
  workerArguments.itemFetched = itemFetched
  returnMessage = {}
  returnMessage.demand = demand
  returnMessage.workerArguments = workerArguments
  self.postMessage returnMessage


```

### Requirements
Malory relies on on the [JavaScript Promise API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).  We suggest checking [browser compatibility]
(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Browser_compatibility) before use and use a [polyfill](https://github.com/slightlyoff/Promises) if necessary

### Future Improvements
* Shift to using plain callbacks or a cross-browser promise library, like [jQuery.deferred](http://api.jquery.com/category/deferred-object/)
* Support for the [catiline](https://github.com/calvinmetcalf/catiline) and [operative](https://github.com/padolsey/operative) libraries
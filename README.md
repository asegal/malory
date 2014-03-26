malory
======
malory is a __web worker manager__, written in CoffeeScript which handles instantiation, messaging, and destruction of a collection of web workers.

### Public API

For full code documentation, including private methods and objects, see [malory.litcoffee](lib/malory.litcoffee)

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

maloryInstance = new malory workerConfig

demand = 'bring me a gin and tonic'
workerArguments = {'ginBrand':'tanqueray'}
maloryInstance.demand(demand, workerArguments).then (drinkArray) ->
  for drink, i in drinkArray
    console.log 'I am having gin and tonic number ' + i
```

##### The Web Worker (employee.coffee)

```coffee
self.addEventListener "message", ((e) ->
  
  # Extract Arguments
  demand = e.data.demand
  workerArguments = e.data.workerArguments
  memoryLimit = workerArguments.memoryLimit

  # Decide Which Course of Action to Take
  itemFetched = ''
  officiallyOutOfMemory = false
  switch demand
    when 'initialize worker' then officiallyOutOfMemory = Boolean(Math.round(Math.random()))
    when 'bring me a gin and tonic' then itemFetched = 'gin and tonic'
    when 'bring me a monte cristo sandwich' then itemFetched = 'monte cristo'

  # Respond to malory
  if itemFetched then workerArguments.itemFetched = itemFetched
  returnMessage = {}
  returnMessage.demand = demand
  returnMessage.officiallyOutOfMemory = officiallyOutOfMemory
  returnMessage.workerArguments = workerArguments
  self.postMessage returnMessage
)

```

### Requirements
Malory relies on the [JavaScript Promise API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).  We suggest checking [browser compatibility]
(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Browser_compatibility) before use and use a [polyfill](https://github.com/slightlyoff/Promises) if necessary

### NPM Install
Get familiar with [node.js](http://nodejs.org/) if you haven't used it
before, then

* _$ npm install malory_

### Contribute
This plugin requires Grunt ~0.4.0

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to
check out the [Getting
Started](http://gruntjs.com/getting-started) guide, as it explains how
to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins.

1. Clone or fork the source, [github.com/glg/malory](http://github.com/glg/malory), then

1. _$ npm install_
 
    gets you the dependencies

1. _$ grunt dev_

    compiles and then starts a webserver on localhost:8100, and
    sets up a file watcher

### Future Improvements
* Shift to using plain callbacks or a cross-browser promise library, like [jQuery.deferred](http://api.jquery.com/category/deferred-object/)
* Support for the [catiline](https://github.com/calvinmetcalf/catiline) and [operative](https://github.com/padolsey/operative) libraries

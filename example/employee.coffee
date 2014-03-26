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

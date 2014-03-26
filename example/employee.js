self.addEventListener("message", (function(e) {
  var demand, itemFetched, memoryLimit, officiallyOutOfMemory, returnMessage, workerArguments;
  demand = e.data.demand;
  workerArguments = e.data.workerArguments;
  memoryLimit = workerArguments.memoryLimit;
  itemFetched = '';
  officiallyOutOfMemory = false;
  switch (demand) {
    case 'initialize worker':
      officiallyOutOfMemory = Boolean(Math.round(Math.random()));
      break;
    case 'bring me a gin and tonic':
      itemFetched = 'gin and tonic';
      break;
    case 'bring me a monte cristo sandwich':
      itemFetched = 'monte cristo';
  }
  if (itemFetched) {
    workerArguments.itemFetched = itemFetched;
  }
  returnMessage = {};
  returnMessage.demand = demand;
  returnMessage.officiallyOutOfMemory = officiallyOutOfMemory;
  returnMessage.workerArguments = workerArguments;
  return self.postMessage(returnMessage);
}));

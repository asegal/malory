console.log('worker instantiating.');
self.addEventListener('message', function(e) {
  var args = e.data.workerArguments;
  var demand = e.data.demand;
  switch (demand) {
    case "loadIndex":
      if (args.index == 'OOM'){
        console.log('worker responding with OOM.');
        self.postMessage({
          workerArguments:args,
          officiallyOutOfMemory:'officiallyOutOfMemory',
          demand: demand});
      } else {
        self.postMessage({
          demand: demand });
      }
      break;
    case "stop":
      self.close();
      break;
    default:
        console.log('malory is demanding '+demand);
        self.postMessage({demand: demand});
   }
 }, false);
console.log('worker instantiated.');

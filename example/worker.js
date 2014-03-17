console.log('worker instantiating');
self.addEventListener('message', function(e) {
  var args = e.data.workerArguments;
  var demand = e.data.demand;
  console.log('malory is demanding '+demand);
  self.postMessage({'demand': demand});
 }, false);
console.log('worker instantiated');

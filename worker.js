self.addEventListener('message', function(e) {
  var args = e.data.workerArguments;
  var demand = e.data.demand;
  self.postMessage({'demand': demand});
 }, false);

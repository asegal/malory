malory
======
malory functions as web worker manager
* will return an object from which a client is able to 
send messages to all workers.
* on message a promise is returned which when reolved will return an array
containing each workers response to the message.

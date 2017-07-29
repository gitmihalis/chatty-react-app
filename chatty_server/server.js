// Server 
const express = require('express')
const SockectServer = require('ws').Server
// Universal unique identifiers for messages
const uuid = require('node-uuid')
// Random colors will be assigned to connected clients
// - randomColor([saturation, value]); 
const randomColor = require('random-color');
// Set the port to 3001
const PORT = 3001
// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`))
// Create a web sockets server
const wss = new SockectServer({ server })
// Keep info on currently connected clients
const CLIENTS = {}
// Keep list of possible colors assignable to connected clients


// A callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the `client` parameter in the callback.
wss.on('connection', (client) => {

  const uniqueId = uuid()

	clientConnected(CLIENTS, uniqueId)

	//  A callback for when a client closes the socket. This usually means they closed their browser.
  client.on('close', () => clientDisconnected(CLIENTS, uniqueId) )

  client.on('message', (incoming) => handleIncoming(incoming))
})

// Broadcast - Goes through each client and sends message data
wss.broadcast = function(data) {
  wss.clients.forEach(function(client) {
    if (client.readyState === client.OPEN) {
      client.send(data)
    }
  })
}
// ==================================== HANDLERS ====
// A client is added to clients on a connection event
function clientConnected(clients, clientId) {
  clients[clientId] = {
    id: clientId
  }
  // Convert clients object to Array before sending to React app
  let clientsArr = Object.keys(clients).map( (key) => clients[key] )
  // Setup message to be set to the client
  // Includes all currently connected clients
  const message = {
    type: 'connectionNotification',
    id: uuid(),
    clients: clientsArr,
  }
  // Broadcast the message 
  wss.broadcast(JSON.stringify(message))
  console.log(`>> client connected`)
}

// Disconnection event
function clientDisconnected(clients, clientId) {
  const client = clients[clientId]
  if (!client) {
    return
  }
  delete clients[clientId]

  // convert CLIENTS object to array before sending to React app
  let clientsArr = Object.keys(clients).map( (key) => clients[key] )

	const message = {
		type: 'disconnectionNotification',
		id: uuid(),
		clients: clientsArr,
	}
  console.log('[^^ clientsArr] ', clientsArr)
  wss.broadcast(JSON.stringify(message))
  console.log(`<< client disconnected`)
}

function handleIncoming(message) {
  const data = JSON.parse(message)
  
  switch(data.type) {
  case "postMessage":
    data.id = uuid()
    data.type = 'incomingMessage'
    wss.broadcast(JSON.stringify(data))
    break
  case "postNotification":
    data.id = uuid()
    data.type = 'incomingNotification'
    wss.broadcast(JSON.stringify(data))
    break
  default:
    console.error('Unkown data type ', data.type)
  }
}



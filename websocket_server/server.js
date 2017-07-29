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
// ================================================
// TODO:: Keep info on currently connected clients
// const CLIENTS = {}
// ================================================

// A callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the `client` parameter in the callback.
wss.on('connection', (client) => {
  // const uniqueId = uuid()
  const uniqueColor = randomColor().hexString()

	clientConnected(uniqueColor)

	// A callback for when a client closes the socket. This usually means they closed their browser.
  client.on('close', clientDisconnected )
  // Callback to handle the incoming message stings
  client.on('message', (message) => handleIncoming(message, uniqueColor) )
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
// TODO:: A client is added to clients on a connection event
function clientConnected(color) {
  // clients[clientId] = {
  //   id: clientId,
  // }
  //
  // Convert clients object to Array before sending to React app
  // let clientsArr = Object.keys(clients).map( (key) => clients[key] )
  //

  // Setup message to be set to the client
  // Includes all currently connected clients
  const message = {
    type: 'connectionNotification',
    id: uuid(),
    color: color,
    clients: wss.clients.size,
  }
  // Broadcast the message 
  wss.broadcast(JSON.stringify(message))
  console.log(`>> client connected`)
}

// Disconnection event
function clientDisconnected() {
  // TODO :: implement client tracking
  // const client = clients[clientId]
  // if (!client) {
  //   return
  // }
  // delete clients[clientId]

  // convert CLIENTS object to array before sending to React app
  // let clientsArr = Object.keys(clients).map( (key) => clients[key] )

	const message = {
		type: 'disconnectionNotification',
		id: uuid(),
		clients: wss.clients.size,
	}

  wss.broadcast(JSON.stringify(message))
  console.log(`<< client disconnected`)
}

function handleIncoming(message, color) {
  const data = JSON.parse(message)
  data.id = uuid()

  switch(data.type) {
  case "postMessage":
    data.type = 'incomingMessage'
    data.color = color
    break
  case "postNotification":
    data.type = 'incomingNotification'
    break
  default:
    console.error('Unkown data type ', data.type)
  }
  wss.broadcast(JSON.stringify(data))
}



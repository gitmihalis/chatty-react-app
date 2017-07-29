import React, {Component} from 'react';
import Chatbar from './Chatbar.jsx';
import MessageList from './MessageList.jsx';
import Message from './Message.jsx';
import Navbar from './Navbar.jsx';


class App extends Component {
  constructor() {
    super()
    this.state = {
      currentUser: { 
        name: "Anonymous", 
        id: '', 
      }, 
      messages: [],
      clients: [],
    }
    this.socket = new WebSocket("ws://localhost:3001")
    this.postMessage = this.postMessage.bind(this)
    this.handleIncomingMessage = this.handleIncomingMessage.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
  }

  // Send text to all users through the server

  componentDidMount() {
    // Create a new Websocket
    // Open a web socket connection
    this.socket.onopen = function(ev) {
      console.log("Connected to server!")
    }
    this.socket.onmessage = this.handleIncomingMessage
    this.socket.onclose = this.handleDisconnect
  }

  handleIncomingMessage(event) {
    // Incoming event is JSON
    console.log(event)
    const data = JSON.parse(event.data)
    switch(data.type) {
      case "incomingMessage":
        console.log('incoming message, type :', data.type)
        // handle a new text message
        this.setState({messages: [...this.state.messages, data]})
        break
      case "incomingNotification":
        console.log('incoming message type :', data.type)
        // handle  username change notification  
        this.setState({ messages: [...this.state.messages, data] })
        break
      case "connectionNotification":
        console.log('incoming message type :', data.type)
        // handle a new client has connected to the server
        this.setState({ clients: data.clients })
        break
      case "disconnectionNotification":
        console.log('incoming message type : ', data.type)
        // handle client closed socket
        this.setState({ clients: data.clients})
      default:
        // show an error in the console if the message type is unknown
        throw new Error("Unknown event type", data.type)
    }
  }

  postMessage(message) {
      // Build the message object to send to the server 
      // which needs to receive JSON
    const newMessage = {}
    newMessage.type = 'postMessage'
    newMessage.username = this.state.currentUser.name
    newMessage.content = message
    this.socket.send(JSON.stringify(newMessage))
  }

  handleUsernameChange(name) {
    if (name === this.state.currentUser.name || !name ) {
      return
    }
    const notification = {}
    notification.type = 'postNotification'
    notification.content = `${this.state.currentUser.name} has changed their name to ${name}`
    this.setState({currentUser: {name: name} })
    this.socket.send(JSON.stringify(notification))
  }

  render() {
    const currentUser = this.state.currentUser.name
    const connectedClientCount = this.state.clients.length
    return (
    	<div>
    		<Navbar connectedClients={connectedClientCount}/>
    		<MessageList messages={this.state.messages}/>
    		<Chatbar username={currentUser} 
                 postMessage={this.postMessage}
                 changeUsername={this.handleUsernameChange} />
    	</div>
    );
  }
}

export default App;
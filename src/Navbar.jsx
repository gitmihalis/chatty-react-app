import React from 'react';

function Navbar(props) {
	console.log("Rendering <Navbar/>")
	return ( 
		<nav className="navbar">
  		<a href="/" className="navbar-brand">Chatty</a>
  		<span className="client-count">{props.connectedClients}</span>
		</nav>
	);
}

export default Navbar;
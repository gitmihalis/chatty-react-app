import React from 'react';

function Navbar(props) {
	console.log("Rendering <Navbar/>")
	return ( 
		<nav className="navbar">
  		<a href="/" className="navbar-brand">Chatty</a>
  			<div className="client-count"> chatters 
  				<span className="badge">{props.connectedClients}</span>
  			</div>
		</nav>
	);
}

export default Navbar;
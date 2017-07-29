import React from 'react';

function Chatbar(props) {

	return (
		<footer className="chatbar">
		  <input className="chatbar-username" 
		  			 placeholder={props.username}
		  			 onBlur={ (event) => props.changeUsername(event.target.value)}
		  			 />
		  <input className="chatbar-message" 
		  			 placeholder="Type a message and hit ENTER"
		  			 onKeyPress={ (event) => {
		  			 	if (event.key === 'Enter') {
		  			 		props.postMessage(event.target.value)
			  			 	event.target.value = "";
		  			 	}
		  			 }}/>
		</footer>
	);
}

export default Chatbar;


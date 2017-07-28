import React from 'react';

function Message(props) {
	let message;

	if (props.type === 'incomingMessage') {
	  message = (
	  	<div className="message">
	    	<span className="message-username">{props.username}</span>
	    	<span className="message-content">
	    		{props.content}
	    	</span>
	  	</div>
	  )
	}

	if (props.type === 'incomingNotification') {
		message = (
			<div className="message system">
  			{props.content}
			</div>
		)
	}
	
	return (
		<div>
		{message}
	  </div>
	);
}

export default Message;
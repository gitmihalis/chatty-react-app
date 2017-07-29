import React from 'react';
import Message from './Message.jsx';

function MessageList(props) {
	const messages = props.messages.map( (msg) => {
		return <Message username={msg.username}
									  content={msg.content}
									  color={msg.color}
									  type={msg.type}
									  key={msg.id} /> }) 
	return (
		<ul>
			{messages}
		</ul>
	)
}

export default MessageList;
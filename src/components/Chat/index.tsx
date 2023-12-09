import React, { useState, useEffect } from 'react';
import { useParams  } from 'react-router-dom';
import io from 'socket.io-client';
import './../../styles/chat.css';



type MessageType = {
  de: string;
  para: string;
  mensaje: string;
};
 

const Chat = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>(''); 

  const { username } = useParams(); 
  const socket = io('https://serverchat-bmmr.onrender.com/');

  useEffect(() => { 
    if (username) {
      socket.emit('userConnected', username);
    } 
      fetch('https://serverchat-bmmr.onrender.com/usersall')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error al obtener la lista de usuarios:', error)); 
      
    socket.on('newMessage', (message: MessageType) => {
      console.log('Nuevo mensaje recibido:', message); 
       
      // Verificar si el mensaje ya está en la lista
      if (!messages.find((msg) => msg.mensaje === message.mensaje)) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.on('storedMessages', (storedMessages: MessageType[]) => {
      console.log('Mensajes almacenados:', storedMessages);  
      setMessages(storedMessages);
    });
  
    socket.emit('getStoredMessages', selectedUser,username);

    return () => {
      if (username) {
        socket.emit('userDisconnected', username);
      }
      socket.disconnect();
    };
  }, [selectedUser]);  

  const handleUserClick = (user: string) => { 
    setSelectedUser(user); 
  };

  const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (selectedUser) {
      const message: MessageType = { de: username || '', para: selectedUser, mensaje: newMessage };
      socket.emit('sendMessage', message);
    }
  };

  const handleExit = () => { 
    window.location.href = '/';  
  };

  return (
    <div className="chat-container">
    <div className="user-list">
      <h2>USUARIOS CONECTADOS</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index} onClick={() => handleUserClick(user)}>
            {user}
          </li>
        ))}
      </ul>
    </div>
    <div className="exit-container">
          <button onClick={handleExit}>Salir</button>
        </div>
    <div className="chat-area">
      <h2>CHAT CON {selectedUser}</h2>
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.de}:</strong> {msg.mensaje}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          id="message"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={handleNewMessageChange}
        />
        <button
          onClick={handleSendMessage}
          disabled={!selectedUser}
          className="send-button"
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
  );
};

export default Chat;
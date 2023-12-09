import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

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

    // Maneja la recepción de la lista de usuarios conectados
    socket.on('userConnected', (connectedUsers: string[]) => {
      console.log('Usuarios Conectados:', connectedUsers);
      setUsers(connectedUsers);
    });

    socket.on('newMessage', (message: MessageType) => {
      console.log('Nuevo mensaje recibido:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('storedMessages', (storedMessages: MessageType) => {
      console.log('Mensajes almacenados:', storedMessages);
      setMessages((prevMessages) => [...prevMessages, storedMessages]);
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

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1 }}>
          <h2>Usuarios Conectados</h2>
          <ul>
            {users.map((user, index) => (
              <li key={index} onClick={() => handleUserClick(user)}>
                {user}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 2 }}>
          <h2>Chat con {selectedUser}</h2>
          <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc' }}>
          
            {messages.map((msg, index) => (
                <div key={index}>
                  <strong>{msg.de}:</strong> {msg.mensaje}
                </div>
              ))}
          </div>
          <div>
            <input
              type="text"
              id="message"
              placeholder="Escribe un mensaje..."
              value={newMessage}
              onChange={handleNewMessageChange}
            />
            <button onClick={handleSendMessage} disabled={!selectedUser}>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
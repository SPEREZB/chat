import { ChangeEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';  
import './../../styles/log.css';
 
  
  const Login = () => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [username, setUsername] = useState('');
    const [realName, setRealName] = useState(''); 
    const [isLogin, setLogin] = useState(false);
  
    const handleUserChange = (e: ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    };
  
    const handleRealNameChange = (e: ChangeEvent<HTMLInputElement>) => {
      setRealName(e.target.value);
    };
  
    const handleRegister = async () => {
      try { 
        const response = await fetch('https://serverchat-bmmr.onrender.com/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          const existingUsers = await response.json(); 
          const usernameExists = existingUsers.some((user: { username: string; }) => user.username === username);
    
          if (!usernameExists) { 
            const registerResponse = await fetch('https://serverchat-bmmr.onrender.com/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, realName }),
            });
    
            if (registerResponse.ok) {
              const user = await registerResponse.json();
              console.log('Usuario registrado:', user); 
              setIsRegistered(true);
            } else {
              setLogin(true);
            }
          } else { 
            setLogin(true);
          }
        } else {
          console.error('Error al obtener la lista de usuarios');
        }
      } catch (error) {
        console.error('Error', error);
      }
    };
  
    return (
      
 <div className="container">
        { (isRegistered || isLogin) && <Navigate to={`/chat/${username}`} replace />}
  
       
          <h1>LOGIN</h1>
          <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={handleUserChange} />
          </div>
  
          <div>
            <label>Name:</label>
            <input type="text" value={realName} onChange={handleRealNameChange} />
          </div>
  
          <button onClick={handleRegister}>GO</button>
      
      </div>
 
      
    );
  };
  
  export default Login;
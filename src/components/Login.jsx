import React, { useState } from 'react';

const LoginForm = () => {
 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

 
  const handleLogin = () => {
    
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    
    if (username === 'yourUsername' && password === 'yourPassword') {
      alert('Login successful!');
     
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;

import React, { useState } from 'react';

const LoginForm = () => {
  // State for storing user input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle login button click
  const handleLogin = () => {
    // Perform validation (you can add more complex validation here)
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    // Assuming a simple check for a hardcoded username and password
    if (username === 'yourUsername' && password === 'yourPassword') {
      alert('Login successful!');
      // Perform additional actions after successful login (e.g., redirect)
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

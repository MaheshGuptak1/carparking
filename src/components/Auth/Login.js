import React, { useState } from 'react';

function Login({ setLoggedIn }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    const user = users.find(user => user.mobile === mobile && user.password === password);
    
    if (user) {
      // Store the user details in localStorage after successful login
      localStorage.setItem('currentUser', JSON.stringify(user));
      setLoggedIn(true);  // Set the login state to true
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;

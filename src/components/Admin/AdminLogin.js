import React, { useState } from 'react';

function AdminLogin({ setAdminLoggedIn }) {
    const [adminPassword, setAdminPassword] = useState('');
    const [error, setError] = useState('');

    const handleAdminLogin = () => {
        const adminCredentials = { password: 'admin123' }; // Example admin password
        if (adminPassword === adminCredentials.password) {
            setAdminLoggedIn(true);
        } else {
            setError('Invalid admin credentials');
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <input
                type="password"
                placeholder="Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
            />
            {error && <p>{error}</p>}
            <button onClick={handleAdminLogin}>Login</button>
        </div>
    );
}

export default AdminLogin;

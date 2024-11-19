import React, { useState } from 'react';

function Signup({ setLoggedIn }) {
    const [mobile, setMobile] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = () => {
        // Check if any field is empty
        if (!mobile || !username || !password) {
            setError('All fields are required!');
            return;
        }

        // Get the existing users from localStorage (initialize as an empty array if it doesn't exist)
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        // Check if a user already exists with the same mobile number
        const userExists = existingUsers.some(user => user.mobile === mobile);

        if (userExists) {
            setError('User with this mobile number already exists!');
        } else {
            // Create a new user
            const newUser = { mobile, username, password };

            // Add the new user to the list of existing users
            existingUsers.push(newUser);

            // Save the updated list of users to localStorage
            localStorage.setItem('users', JSON.stringify(existingUsers));

            // Set the user as logged in and set as currentUser in localStorage
            localStorage.setItem('currentUser', JSON.stringify(newUser));

            // Update logged-in state
            setLoggedIn(true);
            setError('');

            // Optionally reset form fields after successful signup
            setMobile('');
            setUsername('');
            setPassword('');
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <input
                type="text"
                placeholder="Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
            />
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p>{error}</p>}
            <button onClick={handleSignup}>Signup</button>
        </div>
    );
}

export default Signup;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ParkingGrid from './components/Dashboard/ParkingGrid';
import AdminLogin from './components/Admin/AdminLogin';
import AdminPanel from './components/Admin/AdminPanel';
import './styles/App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check user session on component mount
  useEffect(() => {
    const userSession = localStorage.getItem('session');
    const adminSession = localStorage.getItem('admin-session');
    if (userSession) setLoggedIn(true); // Set user as logged in
    if (adminSession) setIsAdminLoggedIn(true); // Set admin as logged in
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('session');
    setLoggedIn(false);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin-session');
    setIsAdminLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* Signup and Login */}
          <Route
            path="/"
            element={
              !loggedIn ? (
                <>
                  <Signup setLoggedIn={setLoggedIn} />
                  <Login setLoggedIn={setLoggedIn} />
                </>
              ) : (
                <Navigate to="/choose-slot" />
              )
            }
          />

          {/* Parking Slot Selection */}
          <Route
            path="/choose-slot"
            element={
              loggedIn ? (
                <ParkingGrid handleLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Admin Login */}
          <Route
            path="/admin-login"
            element={
              !isAdminLoggedIn ? (
                <AdminLogin setAdminLoggedIn={setIsAdminLoggedIn} />
              ) : (
                <Navigate to="/admin-panel" />
              )
            }
          />

          {/* Admin Panel */}
          <Route
            path="/admin-panel"
            element={
              isAdminLoggedIn ? (
                <AdminPanel handleLogout={handleAdminLogout} />
              ) : (
                <Navigate to="/admin-login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

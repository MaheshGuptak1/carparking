export const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};

export const clearLocalStorage = (key) => {
    localStorage.removeItem(key);
};

const handleLogout = () => {
    // Clear the current user from localStorage when logging out
    localStorage.removeItem('currentUser');
    setLoggedIn(false);  // Update the login state to false
  };
  
import React from 'react';

const Header = ({ isAuthenticated, setAccessToken }) => {
  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('accessToken');
    setAccessToken(null);
  };

  return (
    <header>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <div>
          <button onClick={() => setAccessToken(null)}>Login</button>
          <button onClick={() => setAccessToken(null)}>Sign Up</button>
        </div>
      )}
    </header>
  );
};

export default Header;

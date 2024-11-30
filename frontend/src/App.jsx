import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup.jsx';
import ProtectedPage from './components/ProtectedPage';
import Header from './components/Header';

const App = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [accessToken]);

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} setAccessToken={setAccessToken} />
      {isAuthenticated ? (
        <ProtectedPage accessToken={accessToken} setAccessToken={setAccessToken} />
      ) : (
        <div>
          <Login setAccessToken={setAccessToken} />
          <Signup setAccessToken={setAccessToken} />
        </div>
      )}
    </div>
  );
};

export default App;

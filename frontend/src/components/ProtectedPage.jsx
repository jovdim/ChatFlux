import React, { useEffect, useState } from 'react';

const ProtectedPage = ({ accessToken, setAccessToken }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (accessToken) {
      fetchProtectedData();
    }
  }, [accessToken]);

  const fetchProtectedData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/data', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUserData(data);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Failed to fetch data');
    }
  };

  const handleRefreshToken = async () => {
    const response = await fetch('http://localhost:5000/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Includes the refresh token cookie
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('accessToken', data.accessToken);
      setAccessToken(data.accessToken);
      fetchProtectedData();
    } else {
      alert('Session expired, please log in again');
    }
  };

  return (
    <div>
      {userData ? (
        <div>
          <h1>Welcome {userData.firstName}</h1>
          <p>Email: {userData.email}</p>
          <button onClick={handleRefreshToken}>Refresh Token</button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProtectedPage;

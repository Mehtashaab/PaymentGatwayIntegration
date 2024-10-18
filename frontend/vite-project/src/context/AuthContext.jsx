import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // Track loading state

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      setIsAuthenticated(true);  // User stays logged in if token exists
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);  // Loading is complete
  }, []);

  const login = (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;  // Prevent rendering until loading completes
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState('');

  function login() {
    // Simulate login without actual authentication
    setIsLoggedIn(true);
    setAuthToken('dummyAuthToken');
  }

  function logout() {
    // Simulate logout
    setIsLoggedIn(false);
    setAuthToken('');
  }

  const value = {
    isLoggedIn,
    authToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

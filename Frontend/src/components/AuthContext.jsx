import { createContext, useEffect, useState } from 'react';
import { logInService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { RoutesNames } from '../constants';
import useError from '../hooks/useError';
import useLoading from '../hooks/useLoading';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const { showLoading, hideLoading } = useLoading();

  const { prikaziError } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('Bearer');

    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
    } else {
      navigate(RoutesNames.HOME);
    }
  }, []);

  async function login(userData) {
    showLoading();
    const odgovor = await logInService(userData);
    hideLoading();
    if (odgovor.ok) {
      localStorage.setItem('Bearer', odgovor.podaci);
      setAuthToken(odgovor.podaci);
      setIsLoggedIn(true);
      navigate(RoutesNames.NADZORNA_PLOCA);
    } else {
      console.log()
      prikaziError(odgovor.podaci);
      localStorage.setItem('Bearer', '');
      setAuthToken('');
      setIsLoggedIn(false);
    }
  }

  function logout() {
    localStorage.setItem('Bearer', '');
    setAuthToken('');
    setIsLoggedIn(false);
    navigate(RoutesNames.HOME);
  }

  const value = {
    isLoggedIn,
    authToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const getHomeRoute = (user) => {
  if (!user) return '/';
  switch (Number(user.Codigo_Cargo)) {
    case 1:
      return '/VistaAdmin';
    case 2:
      return '/VistaUsuario';
    case 3:
      return '/VistaChofer';
    default:
      return '/';
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Error al leer sesión almacenada:', e);
      return null;
    }
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser && !user) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error al recuperar sesión:', e);
      }
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('IDUSER');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        getHomeRoute: () => getHomeRoute(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


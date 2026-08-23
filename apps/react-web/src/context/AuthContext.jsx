import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { AudioService } from '../services/audio';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nexti_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      nome: 'Estudante Dev',
      email: 'dev@nexti.edu',
      nivel: 1,
      xp: 150,
      moedas: 45
    };
  });

  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem('nexti_user', JSON.stringify(user));
  }, [user]);

  const toggleSound = () => {
    const next = AudioService.toggleSound();
    setSoundEnabled(next);
  };

  const addXp = (amount) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      const currentLvl = prev.nivel;
      const nextLevelXp = currentLvl * 250;
      
      let newLvl = currentLvl;
      if (newXp >= nextLevelXp) {
        newLvl += 1;
        AudioService.playLevelUp();
      }
      return {
        ...prev,
        xp: newXp,
        nivel: newLvl
      };
    });
  };

  const addCoins = (amount) => {
    setUser((prev) => ({
      ...prev,
      moedas: prev.moedas + amount
    }));
  };

  const login = async (email, senha) => {
    const data = await ApiService.login(email, senha);
    if (data && data.token) {
      localStorage.setItem('nexti_jwt_token', data.token);
      if (data.usuario) {
        setUser(data.usuario);
      }
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('nexti_jwt_token');
    setUser({
      id: 0,
      nome: 'Convidado',
      email: '',
      nivel: 1,
      xp: 0,
      moedas: 0
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      addXp,
      addCoins,
      login,
      logout,
      soundEnabled,
      toggleSound
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

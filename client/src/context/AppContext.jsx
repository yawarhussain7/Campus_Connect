import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../api/profile';

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = document.cookie.includes('token=');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response.success) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUserState = () => {
    setUser(null);
    setNotifications([]);
    document.cookie = 'token=; Max-Age=0; path=/';
  };

  const updateUserState = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      loading,
      setLoading,
      notifications,
      setNotifications,
      loginUser,
      logoutUserState,
      updateUserState,
      fetchProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
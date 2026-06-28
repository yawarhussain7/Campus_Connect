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
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage on app start
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Only clear user if it's an authentication error
      if (error?.status === 401 || error?.statusCode === 401) {
        setUser(null);
        localStorage.removeItem('user');
      }
      // For other errors (network, server issues), keep the existing user state
    } finally {
      setLoading(false);
    }
  };

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logoutUserState = () => {
    setUser(null);
    setNotifications([]);
    localStorage.removeItem('user');
    document.cookie = 'token=; Max-Age=0; path=/';
  };

  const updateUserState = (updatedData) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
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
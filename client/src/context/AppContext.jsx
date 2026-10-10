import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  // The navigation drawer is shared between the Header (which opens it) and the
  // Sidebar (which renders it). It only matters below `xl`, where the fixed
  // sidebar is replaced by the slide-in drawer.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((open) => !open),
    []
  );

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
      // Only clear user if it's an authentication error. A blocked account
      // (403 + code from ProtectedRoute) must also drop the local session —
      // the server refuses every further request, so staying "signed in" only
      // produces a wall of errors until the user signs in again.
      if (
        error?.status === 401 ||
        error?.statusCode === 401 ||
        error?.code === 'ACCOUNT_BLOCKED'
      ) {
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
      fetchProfile,
      isSidebarOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
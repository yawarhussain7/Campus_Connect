// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Bell } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getNotifications, markAsRead, markAllAsRead } from '../../api/notifications';

export default function Header({ searchQuery, setSearchQuery, showFilters, setShowFilters }) {
  const { user, notifications, setNotifications } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by department, course title, or instructor tags..." 
          className="w-full bg-slate-100/80 border border-slate-200/80 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-1.5 text-xs border rounded-xl px-3.5 py-2.5 shadow-sm transition-all duration-200 ${
            showFilters 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold' 
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 hover:shadow'
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>Filters</span>
        </button>
        
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4.5 w-4.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-[9px] font-bold text-white rounded-full flex items-center justify-center shadow-sm shadow-indigo-200">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden z-30">
              <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-700">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] text-indigo-600 font-semibold hover:text-indigo-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No notifications yet</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                      className={`p-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${
                        !notif.isRead ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                          !notif.isRead ? 'bg-indigo-500' : 'bg-transparent'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800">{notif.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" 
            alt="Profile" 
            className="h-full w-full rounded-full border-2 border-white object-cover" 
          />
        </div>
      </div>
    </header>
  );
}
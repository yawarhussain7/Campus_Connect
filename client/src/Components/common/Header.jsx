
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Search,
  SlidersHorizontal,
  Bell,
  Check,
  ChevronDown,
  User,
  Settings,
} from 'lucide-react';

import { useAppContext } from '../../context/AppContext';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../../api/notifications';
import { avatarUrl } from '../../api/profile';

const PROFILE_IMAGE =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80';

export default function Header({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  hideSearch = false,
}) {
  const { user, notifications, setNotifications, openSidebar } = useAppContext();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // --------------------------------------------------
  // Fetch notifications
  // --------------------------------------------------

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

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

  // --------------------------------------------------
  // Ctrl + K focuses the search field
  // --------------------------------------------------

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleShortcut);

    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  // --------------------------------------------------
  // Close dropdowns when clicking outside
  // --------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --------------------------------------------------
  // Notification actions
  // --------------------------------------------------

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">

        {/* Menu: only reachable below `xl`, where the sidebar becomes a drawer. */}
        <button
          type="button"
          onClick={openSidebar}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 xl:hidden"
        >
          <MenuIcon className="h-[18px] w-[18px]" />
        </button>

        {/* ==================================================
            SEARCH
        ================================================== */}

        {!hideSearch && (
          <div className="min-w-0 max-w-[520px] flex-1">
          <div className="group relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />

            <input
              ref={searchRef}
              type="text"
              value={searchQuery ?? ''}
              onChange={(e) => setSearchQuery?.(e.target.value)}
              placeholder="Search courses, departments, instructors..."
              className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50/80 pl-9 pr-3 text-[12.5px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15 sm:pr-20"
            />

            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-slate-400 sm:block">
              Ctrl K
            </kbd>
          </div>
        </div>
        )}

        {/* ==================================================
            RIGHT ACTIONS
        ================================================== */}

        <div className={`flex shrink-0 items-center gap-1.5 ${hideSearch ? 'ml-auto' : ''}`}>

          {/* Filters */}
          {setShowFilters && (
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-9 items-center gap-2 rounded-[10px] border px-3 text-[12.5px] font-medium transition ${
                showFilters
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />

              <span className="hidden md:block">Filters</span>
            </button>
          )}

          <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-[10px] text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />

              {unreadCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9.5px] font-semibold text-white ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-11 w-[calc(100vw-2rem)] max-w-[344px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.10)] sm:w-[344px]">

                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Notifications
                    </h3>

                    {unreadCount > 0 && (
                      <p className="mt-0.5 text-xs text-slate-400">
                        {unreadCount} unread
                      </p>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-700"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                        <Bell className="h-4 w-4 text-slate-400" />
                      </div>

                      <p className="mt-3 text-sm font-medium text-slate-600">
                        You&rsquo;re all caught up
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        No new notifications.
                      </p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() =>
                          !notification.isRead &&
                          handleMarkAsRead(notification._id)
                        }
                        className={`flex cursor-pointer gap-3 border-b border-slate-100 px-4 py-3.5 transition-colors ${
                          notification.isRead
                            ? 'bg-white hover:bg-slate-50'
                            : 'bg-blue-50/40 hover:bg-blue-50/70'
                        }`}
                      >
                        <div className="pt-1.5">
                          <span
                            className={`block h-2 w-2 rounded-full ${
                              notification.isRead
                                ? 'bg-slate-200'
                                : 'bg-blue-500'
                            }`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-800">
                            {notification.title}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                            {notification.message}
                          </p>

                          <p className="mt-1.5 text-[11px] text-slate-400">
                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ==================================================
              PROFILE
          ================================================== */}

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex h-10 items-center gap-2 rounded-[10px] pl-1 pr-2 transition hover:bg-slate-50"
            >
              <img
                src={user?.avatar ? avatarUrl(user.avatar) : PROFILE_IMAGE}
                alt={user?.name || 'Profile'}
                onError={(event) => {
                  // A missing/blocked upload falls back to the default portrait
                  // instead of showing a broken image.
                  if (event.currentTarget.src !== PROFILE_IMAGE) {
                    event.currentTarget.src = PROFILE_IMAGE;
                  }
                }}
                className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
              />

              <div className="hidden text-left lg:block">
                <p className="max-w-[120px] truncate text-[13px] font-semibold text-slate-800">
                  {user?.name || 'User'}
                </p>

                <p className="text-[11px] text-slate-400">Student</p>
              </div>

              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 lg:block" />
            </button>

            {/* Profile dropdown */}
            {showProfile && (
              <div className="absolute right-0 top-11 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.10)]">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    navigate('/student/settings');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-slate-600 transition hover:bg-slate-50"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    navigate('/student/settings');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-slate-600 transition hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


import { useEffect, useState } from 'react';

import { useTheme } from '../context/ThemeContext';

import './Navbar.css';

import {
  MdNotificationsNone,
  MdSearch,
  MdDarkMode,
  MdLightMode,
  MdDoneAll,
  MdDeleteOutline,
} from 'react-icons/md';

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteAllNotifications,
  type NotificationData,
} from '../../services/notification.service';

import { NOTIFICATIONS_UPDATED_EVENT } from '../../utils/notificationEvents';

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [showNotifications, setShowNotifications] = useState(false);

  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // =========================
  // LOAD NOTIFICATIONS
  // =========================

  async function loadNotifications() {
    try {
      setLoadingNotifications(true);

      const [notificationData, count] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ]);

      console.log('🔔 NOTIFICATIONS LOADED:', notificationData);

      console.log('🔴 UNREAD COUNT:', count);

      setNotifications(notificationData);
      setUnreadCount(count);
    } catch (error) {
      console.error('❌ LOAD NOTIFICATIONS ERROR:', error);
    } finally {
      setLoadingNotifications(false);
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadNotifications();
  }, []);

  // =========================
  // BACKUP REFRESH
  // =========================

  useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =========================
  // REAL-TIME NOTIFICATIONS
  // =========================

  useEffect(() => {
    function handleNotificationsUpdated() {
      console.log('🔔 NOTIFICATIONS UPDATED EVENT RECEIVED');

      loadNotifications();
    }

    window.addEventListener(
      NOTIFICATIONS_UPDATED_EVENT,
      handleNotificationsUpdated,
    );

    return () => {
      window.removeEventListener(
        NOTIFICATIONS_UPDATED_EVENT,
        handleNotificationsUpdated,
      );
    };
  }, []);

  // =========================
  // OPEN / CLOSE
  // =========================

  function handleNotificationToggle() {
    setShowNotifications((previous) => !previous);
  }

  // =========================
  // MARK ONE AS READ
  // =========================

  async function handleNotificationClick(notification: NotificationData) {
    if (notification.is_read) {
      return;
    }

    try {
      const updatedNotification = await markNotificationAsRead(notification.id);

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === updatedNotification.id ? updatedNotification : item,
        ),
      );

      setUnreadCount((previous) => Math.max(previous - 1, 0));
    } catch (error) {
      console.error('❌ MARK NOTIFICATION AS READ ERROR:', error);
    }
  }

  // =========================
  // MARK ALL AS READ
  // =========================

  async function handleMarkAllAsRead() {
    if (unreadCount === 0) {
      return;
    }

    try {
      await markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error('❌ MARK ALL NOTIFICATIONS AS READ ERROR:', error);
    }
  }

  // =========================
  // DELETE ALL
  // =========================

  async function handleDeleteAllNotifications() {
    if (notifications.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete all notifications?',
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAllNotifications();

      setNotifications([]);
      setUnreadCount(0);
      setShowNotifications(false);
    } catch (error) {
      console.error('❌ DELETE ALL NOTIFICATIONS ERROR:', error);
    }
  }

  // =========================
  // FORMAT DATE
  // =========================

  function formatNotificationDate(date: string) {
    const notificationDate = new Date(date);

    return notificationDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // =========================
  // RENDER
  // =========================

  return (
    <header className="navbar">
      {/* =========================
          SEARCH
      ========================= */}

      <div className="navbar-center">
        <div className="navbar-search">
          <MdSearch />

          <input type="text" placeholder="Search..." />
        </div>
      </div>

      {/* =========================
          RIGHT
      ========================= */}

      <div className="navbar-right">
        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <div className="navbar-notifications">
          <button
            type="button"
            className="navbar-notifications-button"
            onClick={handleNotificationToggle}
            aria-label="Notifications"
            aria-expanded={showNotifications}>
            <MdNotificationsNone />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* =========================
              DROPDOWN
          ========================= */}

          {showNotifications && (
            <div className="notifications-dropdown">
              {/* HEADER */}

              <div className="notifications-header">
                <div>
                  <h3>Notifications</h3>

                  <span>{unreadCount} unread</span>
                </div>

                <div className="notifications-actions">
                  {/* MARK ALL */}

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="mark-all-button"
                      onClick={handleMarkAllAsRead}>
                      <MdDoneAll />

                      <span>Mark all as read</span>
                    </button>
                  )}

                  {/* DELETE ALL */}

                  {notifications.length > 0 && (
                    <button
                      type="button"
                      className="delete-all-button"
                      onClick={handleDeleteAllNotifications}>
                      <MdDeleteOutline />

                      <span>Delete all</span>
                    </button>
                  )}
                </div>
              </div>

              {/* =========================
                  LIST
              ========================= */}

              <div className="notifications-list">
                {loadingNotifications ? (
                  <div className="notifications-empty">
                    <p>Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="notifications-empty">
                    <MdNotificationsNone />

                    <p>No notifications</p>

                    <span>You're all caught up.</span>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      className={`notification-item ${
                        notification.is_read ? 'read' : 'unread'
                      }`}
                      onClick={() => handleNotificationClick(notification)}>
                      <div className="notification-content">
                        <div className="notification-title">
                          {!notification.is_read && (
                            <span className="notification-dot" />
                          )}

                          <strong>{notification.title}</strong>
                        </div>

                        <p>{notification.message}</p>

                        <span className="notification-date">
                          {formatNotificationDate(notification.created_at)}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* =========================
            THEME
        ========================= */}

        <button
          type="button"
          className="navbar-dark-mode"
          onClick={toggleTheme}
          aria-label="Toggle Theme">
          {theme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;

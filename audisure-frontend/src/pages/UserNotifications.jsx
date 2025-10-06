import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/user_notifications.css";

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.post(
          "https://audisure-fullstack.onrender.com/api/get_notifications.php",
          { email: userEmail }
        );
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userEmail]);

  return (
    <div className="page-container">
      <h1 className="page-title">🔔 Notifications</h1>
      <p className="page-description">
        View all updates and document-related alerts in real time.
      </p>

      {loading ? (
        <p className="loading-text">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="no-notifications">No notifications yet.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notif, index) => (
            <li key={index} className="notification-item">
              <div className="notif-header">
                <span className="notif-title">{notif.title}</span>
                <span className="notif-time">{notif.created_at}</span>
              </div>
              <p className="notif-message">{notif.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

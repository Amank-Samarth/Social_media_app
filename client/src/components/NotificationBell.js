import React, { useEffect, useState } from "react";
import { Badge, IconButton, Menu, MenuItem, ListItemAvatar, Avatar, ListItemText, Typography } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const user = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/notifications/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setNotifications(data);
        setUnread(data.filter(n => !n.read).length);
      } catch (err) {
        setNotifications([]);
        setUnread(0);
      }
    };
    if (user && user._id) fetchNotifications();
  }, [user]);

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/notifications/${user._id}/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnread(0);
    } catch (err) {}
  };

  // Toggle menu open/close on click
  const handleBellClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
      markAllAsRead();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleBellClick}>
        <Badge badgeContent={unread} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {notifications.length === 0 && (
          <MenuItem disabled>
            <Typography variant="body2">No notifications</Typography>
          </MenuItem>
        )}
        {notifications.map((n) => (
          <MenuItem key={n._id} onClick={() => {
            handleClose();
            if (n.type === 'like' || n.type === 'comment') {
              navigate(`/post/${n.postId}`);
            } else if (n.type === 'friend') {
              navigate(`/profile/${n.relatedUserId}`);
            } else if (n.type === 'message') {
              navigate('/messages');
            }
          }} selected={!n.read}>
            <ListItemAvatar>
              <Avatar src={n.relatedUserId?.picturePath} />
            </ListItemAvatar>
            <ListItemText
              primary={n.message}
              secondary={new Date(n.createdAt).toLocaleString()}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationBell;

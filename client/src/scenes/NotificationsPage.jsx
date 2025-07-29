import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Button, Divider, CircularProgress, Alert } from "@mui/material";
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useSelector } from "react-redux";

const NotificationsPage = () => {
  const userId = useSelector((state) => state.user?._id);
  const token = useSelector((state) => state.token);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data);
    } catch (e) {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchNotifications();
    // eslint-disable-next-line
  }, [userId, token]);

  const markAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await fetch(`/notifications/${userId}/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (e) {
      setError("Failed to mark all as read.");
    } finally {
      setMarkingAll(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (e) {
      setError("Failed to mark as read.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">Notifications</Typography>
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<MarkEmailReadIcon />}
          onClick={markAllAsRead}
          disabled={markingAll || loading || notifications.length === 0}
        >
          Mark All as Read
        </Button>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : notifications.length === 0 ? (
        <Typography color="text.secondary">No notifications.</Typography>
      ) : (
        <List>
          {notifications.map((notif) => (
            <React.Fragment key={notif._id}>
              <ListItem
                sx={{ bgcolor: notif.read ? 'background.paper' : 'rgba(25, 118, 210, 0.08)' }}
                secondaryAction={
                  !notif.read && (
                    <IconButton edge="end" color="primary" onClick={() => markAsRead(notif._id)}>
                      <NotificationsActiveIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar src={notif.relatedUserId?.picturePath} />
                </ListItemAvatar>
                <ListItemText
                  primary={notif.message}
                  secondary={new Date(notif.createdAt).toLocaleString()}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NotificationsPage;

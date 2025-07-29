import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Divider,
} from "@mui/material";
import {
  Notifications,
  NotificationsNone,
  Check,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import FlexBetween from "./FlexBetween";
import { formatDistanceToNow } from "date-fns";

const NotificationsWidget = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const userId = user._id;

  const getNotifications = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/notifications/${userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(
        `http://localhost:3001/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      getNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(
        `http://localhost:3001/notifications/${userId}/read-all`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      getNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    getNotifications();
    const interval = setInterval(getNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? (
            <Notifications sx={{ fontSize: "25px" }} />
          ) : (
            <NotificationsNone sx={{ fontSize: "25px" }} />
          )}
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          p={2}
          sx={{
            width: 350,
            maxHeight: 400,
            overflow: "auto",
          }}
        >
          <FlexBetween mb={1}>
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <IconButton onClick={markAllAsRead} size="small">
                <Check />
              </IconButton>
            )}
          </FlexBetween>
          <List>
            {notifications.length > 0 ? (
              notifications.map((notification, i) => (
                <Box key={notification._id}>
                  {i > 0 && <Divider />}
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      bgcolor: notification.read
                        ? "transparent"
                        : palette.background.alt,
                      "&:hover": {
                        bgcolor: palette.background.alt,
                      },
                    }}
                    onClick={() => markAsRead(notification._id)}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={`http://localhost:3001/assets/${notification.relatedUserId.picturePath}`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.message}
                      secondary={formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    />
                  </ListItem>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary" align="center">
                No notifications
              </Typography>
            )}
          </List>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationsWidget;

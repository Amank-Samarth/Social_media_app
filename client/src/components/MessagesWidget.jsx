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
  TextField,
} from "@mui/material";
import {
  Message,
  MessageOutlined,
  Send,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import FlexBetween from "./FlexBetween";
import { formatDistanceToNow } from "date-fns";

const MessagesWidget = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [conversations, setConversations] = useState([]);
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const userId = user._id;

  const getMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/messages/${userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setMessages(data);
      setUnreadCount(data.filter((m) => !m.read && m.receiverId === userId).length);
      
      // Group messages by conversation
      const convMap = new Map();
      data.forEach((message) => {
        const otherId = message.senderId._id === userId ? message.receiverId._id : message.senderId._id;
        const otherUser = message.senderId._id === userId ? message.receiverId : message.senderId;
        if (!convMap.has(otherId)) {
          convMap.set(otherId, {
            user: otherUser,
            lastMessage: message,
            unread: message.receiverId === userId && !message.read ? 1 : 0,
          });
        } else {
          const conv = convMap.get(otherId);
          if (new Date(message.createdAt) > new Date(conv.lastMessage.createdAt)) {
            conv.lastMessage = message;
          }
          if (message.receiverId === userId && !message.read) {
            conv.unread++;
          }
        }
      });
      setConversations(Array.from(convMap.values()));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const getConversation = async (otherUserId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/messages/${userId}/${otherUserId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching conversation:", error);
      return [];
    }
  };

  const sendMessage = async () => {
    if (!messageContent.trim() || !selectedUser) return;

    try {
      await fetch("http://localhost:3001/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: userId,
          receiverId: selectedUser._id,
          content: messageContent,
        }),
      });
      setMessageContent("");
      getMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await fetch(
        `http://localhost:3001/messages/${messageId}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      getMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  useEffect(() => {
    getMessages();
    const interval = setInterval(getMessages, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    const conversation = await getConversation(user._id);
    setMessages(conversation);
    conversation
      .filter((m) => m.receiverId === userId && !m.read)
      .forEach((m) => markAsRead(m._id));
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? (
            <Message sx={{ fontSize: "25px" }} />
          ) : (
            <MessageOutlined sx={{ fontSize: "25px" }} />
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
            height: 500,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" mb={2}>
            {selectedUser ? (
              <FlexBetween>
                <IconButton size="small" onClick={() => setSelectedUser(null)}>
                  ←
                </IconButton>
                {`${selectedUser.firstName} ${selectedUser.lastName}`}
              </FlexBetween>
            ) : (
              "Messages"
            )}
          </Typography>

          <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            {selectedUser ? (
              <List>
                {messages.map((message, i) => (
                  <Box key={message._id}>
                    {i > 0 && <Divider />}
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        flexDirection: message.senderId._id === userId ? 'row-reverse' : 'row',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={`http://localhost:3001/assets/${
                            message.senderId._id === userId
                              ? user.picturePath
                              : selectedUser.picturePath
                          }`}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={message.content}
                        secondary={formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                        sx={{
                          '& .MuiListItemText-primary': {
                            bgcolor: message.senderId._id === userId
                              ? palette.primary.light
                              : palette.background.alt,
                            p: 1,
                            borderRadius: 1,
                            display: 'inline-block',
                          },
                        }}
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            ) : (
              <List>
                {conversations.map((conv, i) => (
                  <Box key={conv.user._id}>
                    {i > 0 && <Divider />}
                    <ListItem
                      button
                      onClick={() => handleUserSelect(conv.user)}
                      sx={{
                        bgcolor: conv.unread ? palette.background.alt : "transparent",
                      }}
                    >
                      <ListItemAvatar>
                        <Badge badgeContent={conv.unread} color="error">
                          <Avatar
                            src={`http://localhost:3001/assets/${conv.user.picturePath}`}
                          />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${conv.user.firstName} ${conv.user.lastName}`}
                        secondary={conv.lastMessage.content}
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            )}
          </Box>

          {selectedUser && (
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <IconButton onClick={sendMessage} disabled={!messageContent.trim()}>
                <Send />
              </IconButton>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default MessagesWidget;

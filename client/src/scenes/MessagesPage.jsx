import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, TextField, IconButton, CircularProgress, Alert, Paper } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from "react-redux";

const MessagesPage = () => {
  const userId = useSelector((state) => state.user?._id);
  const token = useSelector((state) => state.token);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");
  const [msgInput, setMsgInput] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/messages/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        // Group messages by other participant
        const convMap = {};
        data.forEach(msg => {
          const otherUser = msg.senderId._id === userId ? msg.receiverId : msg.senderId;
          if (!convMap[otherUser._id]) {
            convMap[otherUser._id] = { user: otherUser, lastMsg: msg, messages: [] };
          }
          if (!convMap[otherUser._id].lastMsg.createdAt || new Date(msg.createdAt) > new Date(convMap[otherUser._id].lastMsg.createdAt)) {
            convMap[otherUser._id].lastMsg = msg;
          }
        });
        setConversations(Object.values(convMap));
      } catch (e) {
        setError("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };
    if (userId && token) fetchConversations();
  }, [userId, token]);

  const fetchMessages = async (otherUserId) => {
    setLoadingMessages(true);
    setError("");
    try {
      const res = await fetch(`/messages/${userId}/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
    } catch (e) {
      setError("Failed to load messages.");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectConversation = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id);
  };

  const handleSendMessage = async () => {
    if (!msgInput.trim() || !selectedUser) return;
    setSending(true);
    try {
      await fetch(`/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senderId: userId, receiverId: selectedUser._id, content: msgInput }),
      });
      setMsgInput("");
      fetchMessages(selectedUser._id);
    } catch (e) {
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">Messages</Typography>
      <Grid container spacing={3}>
        {/* Conversation List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ borderRadius: 3, boxShadow: 2, p: 2 }}>
            <Typography fontWeight={600} mb={2}>Conversations</Typography>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : conversations.length === 0 ? (
              <Typography color="text.secondary">No conversations.</Typography>
            ) : (
              <List>
                {conversations.map(conv => (
                  <ListItem
                    button
                    key={conv.user._id}
                    selected={selectedUser && conv.user._id === selectedUser._id}
                    onClick={() => handleSelectConversation(conv.user)}
                  >
                    <ListItemAvatar>
                      <Avatar src={conv.user.picturePath} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={conv.user.firstName + " " + conv.user.lastName}
                      secondary={conv.lastMsg.content}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        {/* Chat Window */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 3, boxShadow: 2, p: 2, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            {selectedUser ? (
              <>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar src={selectedUser.picturePath} sx={{ mr: 2 }} />
                  <Typography fontWeight={600}>{selectedUser.firstName + " " + selectedUser.lastName}</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box flex={1} overflow="auto" mb={2}>
                  {loadingMessages ? (
                    <CircularProgress />
                  ) : error ? (
                    <Alert severity="error">{error}</Alert>
                  ) : messages.length === 0 ? (
                    <Typography color="text.secondary">No messages yet.</Typography>
                  ) : (
                    messages.map((msg, idx) => (
                      <Box key={msg._id || idx} mb={1} display="flex" flexDirection={msg.senderId._id === userId ? "row-reverse" : "row"} alignItems="center">
                        <Avatar src={msg.senderId.picturePath} sx={{ width: 28, height: 28, mx: 1 }} />
                        <Paper sx={{ p: 1.5, bgcolor: msg.senderId._id === userId ? 'primary.light' : 'grey.100', minWidth: 60 }}>
                          <Typography fontSize={15}>{msg.content}</Typography>
                          <Typography fontSize={11} color="text.secondary" align="right">{new Date(msg.createdAt).toLocaleTimeString()}</Typography>
                        </Paper>
                      </Box>
                    ))
                  )}
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={msgInput}
                    onChange={e => setMsgInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                    disabled={sending}
                  />
                  <IconButton color="primary" onClick={handleSendMessage} disabled={sending || !msgInput.trim()}>
                    <SendIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Typography color="text.secondary">Select a conversation to start chatting.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessagesPage;

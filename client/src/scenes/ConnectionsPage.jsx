import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Divider, CircularProgress, Alert } from "@mui/material";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ChatIcon from '@mui/icons-material/Chat';
import { useSelector } from "react-redux";

const ConnectionsPage = () => {
  const userId = useSelector((state) => state.user?._id);
  const token = useSelector((state) => state.token);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/users/${userId}/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch connections");
        const data = await res.json();
        setConnections(data);
      } catch (e) {
        setError("Failed to load connections.");
      } finally {
        setLoading(false);
      }
    };
    if (userId && token) fetchConnections();
  }, [userId, token]);

  const removeConnection = async (friendId) => {
    try {
      const res = await fetch(`/users/${userId}/friends/${friendId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to remove connection");
      setConnections(prev => prev.filter(conn => conn._id !== friendId));
    } catch (e) {
      setError("Failed to remove connection.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">Connections</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : connections.length === 0 ? (
        <Typography color="text.secondary">No connections found.</Typography>
      ) : (
        <List>
          {connections.map(conn => (
            <React.Fragment key={conn._id}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton color="primary" href={`/messages?user=${conn._id}`}>
                      <ChatIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => removeConnection(conn._id)}>
                      <PersonRemoveIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemAvatar>
                  <Avatar src={conn.picturePath} />
                </ListItemAvatar>
                <ListItemText
                  primary={conn.firstName + " " + conn.lastName}
                  secondary={conn.occupation}
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

export default ConnectionsPage;
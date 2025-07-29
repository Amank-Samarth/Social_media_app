import React, { useState } from "react";
import { Box, Typography, Grid, Card, CardHeader, CardContent, CardActions, Button, Avatar, Divider } from "@mui/material";

// TODO: Integrate with backend when available
const mockBookmarks = [
  { id: 1, author: "Alice Johnson", avatar: "https://randomuser.me/api/portraits/women/68.jpg", content: "Just launched a new React project! 🚀", tag: "#ReactJS" },
  { id: 2, author: "Bob Lee", avatar: "https://randomuser.me/api/portraits/men/65.jpg", content: "Node.js streams are powerful!", tag: "#NodeJS" },
];

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState(mockBookmarks);

  // TODO: Replace with backend calls when API is available
  const handleRemove = (id) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">Bookmarks</Typography>
      <Grid container spacing={3}>
        {bookmarks.length === 0 ? (
          <Typography color="text.secondary" sx={{ mx: 2 }}>No bookmarks yet.</Typography>
        ) : bookmarks.map(b => (
          <Grid item xs={12} md={6} key={b.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardHeader
                avatar={<Avatar src={b.avatar} />}
                title={b.author}
                subheader={b.tag}
              />
              <CardContent>
                <Typography>{b.content}</Typography>
              </CardContent>
              <CardActions>
                <Button color="error" onClick={() => handleRemove(b.id)}>Remove</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 4 }} />
      <Typography color="text.secondary" fontSize={14}>
        <b>Note:</b> Bookmarks currently use mock data. Backend integration can be added when an API is available.
      </Typography>
    </Box>
  );
};

export default BookmarksPage;
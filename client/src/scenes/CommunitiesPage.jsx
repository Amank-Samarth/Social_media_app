import React, { useState } from "react";
import { Box, Typography, Grid, Card, CardHeader, CardActions, Button, Avatar, Divider } from "@mui/material";
// TODO: Integrate with backend when available
const mockJoined = [
  { id: 1, name: "React Developers", members: 1200, avatar: "https://randomuser.me/api/portraits/men/77.jpg" },
  { id: 2, name: "Node.js Enthusiasts", members: 900, avatar: "https://randomuser.me/api/portraits/women/78.jpg" },
];
const mockExplore = [
  { id: 3, name: "Open Source", members: 1500, avatar: "https://randomuser.me/api/portraits/men/79.jpg" },
  { id: 4, name: "Web Designers", members: 700, avatar: "https://randomuser.me/api/portraits/women/80.jpg" },
];

const CommunitiesPage = () => {
  const [joined, setJoined] = useState(mockJoined);
  const [explore, setExplore] = useState(mockExplore);

  // TODO: Replace with backend calls when API is available
  const handleJoin = (id) => {
    const comm = explore.find(c => c.id === id);
    setJoined([...joined, comm]);
    setExplore(explore.filter(c => c.id !== id));
  };
  const handleLeave = (id) => {
    const comm = joined.find(c => c.id === id);
    setExplore([...explore, comm]);
    setJoined(joined.filter(c => c.id !== id));
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">Communities</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={600} mb={2}>Joined Communities</Typography>
          {joined.length === 0 ? (
            <Typography color="text.secondary">You haven't joined any communities.</Typography>
          ) : (
            joined.map(comm => (
              <Card key={comm.id} sx={{ mb: 2, borderRadius: 3, boxShadow: 2 }}>
                <CardHeader
                  avatar={<Avatar src={comm.avatar} />}
                  title={comm.name}
                  subheader={`${comm.members} members`}
                />
                <CardActions>
                  <Button color="error" onClick={() => handleLeave(comm.id)}>Leave</Button>
                </CardActions>
              </Card>
            ))
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={600} mb={2}>Explore Communities</Typography>
          {explore.length === 0 ? (
            <Typography color="text.secondary">No more communities to join.</Typography>
          ) : (
            explore.map(comm => (
              <Card key={comm.id} sx={{ mb: 2, borderRadius: 3, boxShadow: 2 }}>
                <CardHeader
                  avatar={<Avatar src={comm.avatar} />}
                  title={comm.name}
                  subheader={`${comm.members} members`}
                />
                <CardActions>
                  <Button color="primary" onClick={() => handleJoin(comm.id)}>Join</Button>
                </CardActions>
              </Card>
            ))
          )}
        </Grid>
      </Grid>
      <Divider sx={{ my: 4 }} />
      <Typography color="text.secondary" fontSize={14}>
        <b>Note:</b> Community features use mock data. Backend integration can be added when an API is available.
      </Typography>
    </Box>
  );
};

export default CommunitiesPage;

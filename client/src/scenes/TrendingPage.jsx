import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Chip, Divider, Card, CardHeader, CardContent, Avatar } from "@mui/material";

// Mock trending data
const trendingTopics = [
  { tag: "#ReactJS", posts: 120, topPost: { author: "Alice Johnson", avatar: "https://randomuser.me/api/portraits/women/68.jpg", content: "Hooks are a game changer!" } },
  { tag: "#NodeJS", posts: 95, topPost: { author: "Bob Lee", avatar: "https://randomuser.me/api/portraits/men/65.jpg", content: "Async/await makes life easier." } },
  { tag: "#WebDev", posts: 80, topPost: { author: "Charlie Kim", avatar: "https://randomuser.me/api/portraits/men/66.jpg", content: "CSS Grid is powerful!" } },
];

const TrendingPage = () => (
  <Box sx={{ maxWidth: 700, mx: "auto", py: 4, px: 2 }}>
    <Typography variant="h4" fontWeight={700} mb={3} color="primary">Trending</Typography>
    <List>
      {trendingTopics.map(topic => (
        <React.Fragment key={topic.tag}>
          <ListItem alignItems="flex-start" sx={{ mb: 2 }}>
            <ListItemText
              primary={<Typography variant="h6" fontWeight={600}><Chip label={topic.tag} color="secondary" sx={{ mr: 1 }} />{topic.posts} posts</Typography>}
              secondary={
                <Card sx={{ mt: 1, borderRadius: 2, boxShadow: 1 }}>
                  <CardHeader
                    avatar={<Avatar src={topic.topPost.avatar} />}
                    title={topic.topPost.author}
                  />
                  <CardContent>
                    <Typography>{topic.topPost.content}</Typography>
                  </CardContent>
                </Card>
              }
            />
          </ListItem>
          <Divider component="li" />
        </React.Fragment>
      ))}
    </List>
  </Box>
);

export default TrendingPage;

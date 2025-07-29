import React, { useState, useEffect } from "react";
import { Box, Typography, Chip, Avatar, Grid, Card, CardHeader, CardContent, CardActions, Button, TextField, InputAdornment, IconButton, Divider, CircularProgress, Alert } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useSelector } from "react-redux";

const ExplorePage = () => {
  const [trendingTags, setTrendingTags] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [publicPosts, setPublicPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.user?._id);

  useEffect(() => {
    const fetchExploreData = async () => {
      setLoading(true);
      setError("");
      try {
        // Trending Tags
        const trendingRes = await fetch("/sidebar/trending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const trendingData = await trendingRes.json();
        setTrendingTags(trendingData);
        // Suggested Users
        const suggestionsRes = await fetch(`/sidebar/suggestions?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const suggestionsData = await suggestionsRes.json();
        setSuggestedUsers(suggestionsData);
        // Public Posts
        const postsRes = await fetch("/posts");
        const postsData = await postsRes.json();
        setPublicPosts(postsData);
      } catch (err) {
        setError("Failed to load explore data.");
      } finally {
        setLoading(false);
      }
    };
    if (token && userId) fetchExploreData();
  }, [token, userId]);

  const filteredPosts = publicPosts.filter(post =>
    post.description?.toLowerCase().includes(search.toLowerCase()) ||
    post.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    post.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    (post.description?.match(/#\w+/g) || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">Explore</Typography>
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search posts, tags, or users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Trending Tags */}
          <Grid item xs={12} md={4}>
            <Box mb={2}>
              <Typography variant="h6" fontWeight={600} mb={1}>Trending Tags</Typography>
              {trendingTags.length === 0 ? (
                <Typography color="text.secondary">No trending tags.</Typography>
              ) : trendingTags.map(tag => (
                <Chip
                  key={tag.tag}
                  label={`${tag.tag} (${tag.count})`}
                  color="secondary"
                  clickable
                  sx={{ m: 0.5, fontWeight: 500 }}
                />
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="h6" fontWeight={600} mb={1}>Suggested Users</Typography>
              {suggestedUsers.length === 0 ? (
                <Typography color="text.secondary">No suggestions.</Typography>
              ) : suggestedUsers.map(user => (
                <Card key={user._id} sx={{ mb: 2 }} variant="outlined">
                  <CardHeader
                    avatar={<Avatar src={user.picturePath} />}
                    title={user.firstName + " " + user.lastName}
                    subheader={user.occupation}
                    action={<IconButton color="primary"><PersonAddIcon /></IconButton>}
                  />
                </Card>
              ))}
            </Box>
          </Grid>
          {/* Public Posts */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" fontWeight={600} mb={2}>Recent Posts</Typography>
            {filteredPosts.length === 0 ? (
              <Typography color="text.secondary">No posts found.</Typography>
            ) : (
              filteredPosts.map(post => (
                <Card key={post._id} sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
                  <CardHeader
                    avatar={<Avatar src={post.userPicturePath} />}
                    title={<Typography fontWeight={600}>{post.firstName + " " + post.lastName}</Typography>}
                    subheader={post.description.match(/#\w+/g)?.join(" ")}
                  />
                  <CardContent>
                    <Typography>{post.description}</Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton><FavoriteBorderIcon /></IconButton>
                    <IconButton><ChatBubbleOutlineIcon /></IconButton>
                    <Button size="small" color="primary">Share</Button>
                  </CardActions>
                </Card>
              ))
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ExplorePage;

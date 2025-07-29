import React, { useState } from "react";
import { Box, Typography, Grid, Card, CardHeader, CardContent, CardActions, Button, Avatar, Divider, Chip } from "@mui/material";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

// TODO: Integrate with backend when available
const mockJobs = [
  { id: 1, title: "Frontend Developer", company: "Tech Solutions", location: "Remote", tags: ["React", "UI"], logo: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png", avatar: "https://randomuser.me/api/portraits/men/81.jpg", description: "React, Redux, Material-UI experience required.", saved: false },
  { id: 2, title: "Backend Engineer", company: "NodeWorks", location: "Bangalore", tags: ["Node.js", "API"], logo: "https://cdn-icons-png.flaticon.com/512/5968/5968322.png", avatar: "https://randomuser.me/api/portraits/women/82.jpg", description: "Node.js, MongoDB, API design.", saved: false },
  { id: 3, title: "Fullstack Developer", company: "WebGenius", location: "San Francisco", tags: ["React", "Node.js"], logo: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png", avatar: "https://randomuser.me/api/portraits/men/83.jpg", description: "Fullstack development experience required.", saved: false },
];

const JobsPage = () => {
  const [jobs, setJobs] = useState(mockJobs);

  // TODO: Replace with backend calls when API is available
  const handleApply = (id) => {
    // Placeholder for future backend integration
    alert("Applied to job " + id);
  };

  const saveJob = (id) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, saved: !j.saved } : j));
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">Jobs</Typography>
      <Grid container spacing={3}>
        {jobs.length === 0 ? (
          <Typography color="text.secondary" sx={{ mx: 2 }}>No jobs available.</Typography>
        ) : jobs.map(job => (
          <Grid item xs={12} md={6} key={job.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardHeader
                avatar={<Avatar src={job.logo}><WorkOutlineIcon /></Avatar>}
                title={job.title}
                subheader={job.company + " • " + job.location}
              />
              <CardContent>
                {job.tags.map(tag => <Chip key={tag} label={tag} color="secondary" size="small" sx={{ mr: 1, mb: 1 }} />)}
                <Typography>{job.description}</Typography>
              </CardContent>
              <CardActions>
                <Button color="primary" onClick={() => handleApply(job.id)}>Apply</Button>
                <Button
                  color={job.saved ? "secondary" : "primary"}
                  startIcon={<BookmarkBorderIcon />}
                  onClick={() => saveJob(job.id)}
                >
                  {job.saved ? "Saved" : "Save"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 4 }} />
      <Typography color="text.secondary" fontSize={14}>
        <b>Note:</b> Jobs currently use mock data. Backend integration can be added when an API is available.
      </Typography>
    </Box>
  );
};

export default JobsPage;

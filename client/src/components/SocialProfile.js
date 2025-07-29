import React from "react";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SocialProfile = ({ showEdit = true }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Box display="flex" alignItems="center" gap={2} mb={2}>
      <Avatar
        src={user.picturePath ? `http://localhost:3001/assets/${user.picturePath}` : undefined}
        sx={{ width: 56, height: 56, cursor: 'pointer' }}
        onClick={() => navigate(`/profile/${user._id}`)}
      />
      <Box flexGrow={1} onClick={() => navigate(`/profile/${user._id}`)} sx={{ cursor: 'pointer' }}>
        <Typography variant="h6" fontWeight={600}>{user.firstName} {user.lastName}</Typography>
        <Typography variant="body2" color="textSecondary">{user.occupation || 'Your headline here'}</Typography>
      </Box>
      {showEdit && (
        <IconButton onClick={() => navigate(`/profile/${user._id}?edit=1`)} color="primary" size="small">
          <EditIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default SocialProfile;
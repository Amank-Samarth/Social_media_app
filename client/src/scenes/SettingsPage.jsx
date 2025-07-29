import React, { useState } from "react";
import { Box, Typography, Paper, TextField, Button, Divider, Alert } from "@mui/material";

// TODO: Integrate with backend when available
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@email.com",
  occupation: "Software Engineer",
};

const SettingsPage = () => {
  // TODO: Replace with backend user data when API is available
  const [user, setUser] = useState(mockUser);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // TODO: Replace with backend call
  const handleSave = (e) => {
    e.preventDefault();
    setSuccess(true);
    setError("");
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">Settings</Typography>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <form onSubmit={handleSave}>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            value={user.firstName}
            onChange={e => setUser({ ...user, firstName: e.target.value })}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            value={user.lastName}
            onChange={e => setUser({ ...user, lastName: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={user.email}
            onChange={e => setUser({ ...user, email: e.target.value })}
            disabled
          />
          <TextField
            label="Occupation"
            fullWidth
            margin="normal"
            value={user.occupation}
            onChange={e => setUser({ ...user, occupation: e.target.value })}
          />
          <Divider sx={{ my: 2 }} />
          <Button variant="contained" color="primary" type="submit" fullWidth>Save Changes</Button>
        </form>
        {success && <Alert severity="success" sx={{ mt: 2 }}>Profile updated successfully (mock).</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Typography color="text.secondary" fontSize={14} mt={3}>
          <b>Note:</b> Settings currently use mock data. Backend integration can be added when an API is available.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SettingsPage;

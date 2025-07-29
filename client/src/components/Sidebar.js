import React, { useEffect, useState, useRef } from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText, Button, Divider, Avatar, Typography, IconButton, Tooltip, Fade, useTheme, alpha } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/TravelExplore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkIcon from '@mui/icons-material/Work';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SocialProfile from './SocialProfile';

const SIDEBAR_MIN_WIDTH = 56;
const SIDEBAR_MAX_WIDTH = 340;
const SIDEBAR_DEFAULT_WIDTH = 260;

const navLinks = [
  { icon: <HomeIcon />, label: "Home", to: "/home" },
  { icon: <ExploreIcon />, label: "Explore", to: "/explore" },
  { icon: <NotificationsIcon />, label: "Notifications", to: "/notifications" },
  { icon: <MessageIcon />, label: "Messages", to: "/messages" },
  { icon: <BookmarkIcon />, label: "Bookmarks", to: "/bookmarks" },
  { icon: <PeopleIcon />, label: "Connections", to: "/connections" },
  { icon: <GroupIcon />, label: "Communities", to: "/communities" },
  { icon: <TrendingUpIcon />, label: "Trending", to: "/trending" },
  { icon: <WorkIcon />, label: "Jobs", to: "/jobs" },
  { icon: <BarChartIcon />, label: "Analytics", to: "/analytics" },
  { icon: <SettingsIcon />, label: "Settings", to: "/settings" },
];

const Sidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [trending, setTrending] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? Number(saved) : SIDEBAR_DEFAULT_WIDTH;
  });
  const [collapsed, setCollapsed] = useState(width <= SIDEBAR_MIN_WIDTH + 10);
  const [hovered, setHovered] = useState(false);
  const sidebarRef = useRef();

  useEffect(() => {
    localStorage.setItem('sidebarWidth', width);
    setCollapsed(width <= SIDEBAR_MIN_WIDTH + 10);
  }, [width]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const token = localStorage.getItem('token');
        const trendingRes = await fetch('/sidebar/trending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const trendingData = await trendingRes.json();
        setTrending(trendingData);
        const suggestionsRes = await fetch(`/sidebar/suggestions?userId=${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const suggestionsData = await suggestionsRes.json();
        setSuggestions(suggestionsData);
      } catch (err) {
        setTrending([]);
        setSuggestions([]);
      }
    };
    if (user && user._id) fetchSidebarData();
  }, [user]);

  // Drag-to-resize interaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sidebarRef.current || !sidebarRef.current.resizing) return;
      let newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth < SIDEBAR_MIN_WIDTH) newWidth = SIDEBAR_MIN_WIDTH;
      if (newWidth > SIDEBAR_MAX_WIDTH) newWidth = SIDEBAR_MAX_WIDTH;
      setWidth(newWidth);
    };
    const handleMouseUp = () => {
      if (sidebarRef.current) sidebarRef.current.resizing = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleCollapse = () => {
    setWidth(SIDEBAR_MIN_WIDTH);
  };
  const handleExpand = () => {
    setWidth(SIDEBAR_DEFAULT_WIDTH);
  };

  // Drag handle for resizing
  const handleDragStart = (e) => {
    if (sidebarRef.current) sidebarRef.current.resizing = true;
  };

  // Visual feedback for hover
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  return (
    <Box
      ref={sidebarRef}
      sx={{
        width: width,
        minWidth: SIDEBAR_MIN_WIDTH,
        maxWidth: SIDEBAR_MAX_WIDTH,
        minHeight: '100vh',
        borderRight: `1.5px solid ${alpha(theme.palette.divider, 0.5)}`,
        p: collapsed ? 1 : 2,
        bgcolor: collapsed ? theme.palette.background.default : theme.palette.background.paper,
        position: 'sticky',
        top: 0,
        transition: 'width 0.2s cubic-bezier(.4,2,.6,1)',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        zIndex: 1201,
        boxShadow: hovered && !collapsed ? 4 : 0,
        borderRadius: collapsed ? '0 16px 16px 0' : '0',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Collapse/Expand and Drag Handle */}
      <Box display="flex" alignItems="center" mb={1} justifyContent={collapsed ? 'center' : 'space-between'}>
        {!collapsed && (
          <Typography variant="h6" fontWeight={700} sx={{ ml: 1, opacity: 0.85 }}>Menu</Typography>
        )}
        <Tooltip title={collapsed ? "Expand" : "Collapse"} arrow placement="right">
          <IconButton size="small" onClick={collapsed ? handleExpand : handleCollapse} sx={{ ml: collapsed ? 0 : 'auto', mr: 0.5 }}>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
        {/* Drag handle */}
        {!collapsed && (
          <Tooltip title="Resize sidebar" arrow placement="right">
            <IconButton
              size="small"
              sx={{ cursor: 'ew-resize', ml: 0.5, color: theme.palette.divider }}
              onMouseDown={handleDragStart}
              disableRipple
            >
              <DragHandleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      {/* Social Profile */}
      <Fade in={!collapsed}><Box>{!collapsed && <SocialProfile showEdit />}</Box></Fade>
      {/* Quick Post Composer */}
      <Fade in={!collapsed}><Box>{!collapsed && <Button fullWidth variant="contained" color="primary" startIcon={<AddIcon />} sx={{ mb: 2, mt: 1, borderRadius: 3, fontWeight: 600, textTransform: 'none' }} onClick={() => navigate('/home#composer')}>
        Start a Post
      </Button>}</Box></Fade>
      {/* Navigation Links */}
      <List sx={{ mt: 1 }}>
        {navLinks.map((item, idx) => (
          <Tooltip key={item.label} title={collapsed ? item.label : ""} placement="right" arrow enterDelay={300}>
            <ListItem button onClick={() => item.to && navigate(item.to)} sx={{ borderRadius: 2, mb: 0.5, px: collapsed ? 1 : 2, py: 1, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.07) } }}>
              <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2 }}>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItem>
          </Tooltip>
        ))}
      </List>
      <Divider sx={{ my: collapsed ? 1 : 2, opacity: 0.7 }} />
      {/* Trending Topics */}
      <Fade in={!collapsed}><Box mb={2}>{!collapsed && <>
        <Typography variant="subtitle1" fontWeight={600} mb={1} color="primary">Trending Topics</Typography>
        <List dense>
          {trending.length === 0 && <ListItem><ListItemText primary="No trending topics" /></ListItem>}
          {trending.map(({ tag, count }) => (
            <ListItem button key={tag} sx={{ borderRadius: 2 }}>
              <ListItemText primary={tag} secondary={`${count} posts`} />
            </ListItem>
          ))}
        </List>
      </>}</Box></Fade>
      {/* People You May Know */}
      <Fade in={!collapsed}><Box>{!collapsed && <>
        <Typography variant="subtitle1" fontWeight={600} mb={1} color="primary">People You May Know</Typography>
        <List dense>
          {suggestions.length === 0 && <ListItem><ListItemText primary="No suggestions" /></ListItem>}
          {suggestions.map((s) => (
            <ListItem button key={s._id} onClick={() => navigate(`/profile/${s._id}`)} sx={{ borderRadius: 2 }}>
              <Avatar src={s.picturePath} sx={{ width: 28, height: 28, mr: 1 }} />
              <ListItemText primary={`${s.firstName} ${s.lastName}`} secondary={s.occupation} />
              <Button size="small" variant="contained" color="primary" sx={{ ml: 1, textTransform: 'none', borderRadius: 2 }}>Connect</Button>
            </ListItem>
          ))}
        </List>
      </>}</Box></Fade>
    </Box>
  );
};

export default Sidebar;
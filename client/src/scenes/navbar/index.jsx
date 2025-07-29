import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  alpha,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  Avatar
} from "@mui/material";
import {
  Search,
  DarkMode,
  LightMode,
  Menu,
  Close,
  ArrowDropDown
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import HelpWidget from "components/HelpWidget";
import NotificationBell from "components/NotificationBell";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;

  // User menu handlers
  const handleUserMenuClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
      setUserMenuOpen(false);
    } else {
      setAnchorEl(event.currentTarget);
      setUserMenuOpen(true);
    }
  };
  const handleUserMenuClose = () => {
    setAnchorEl(null);
    setUserMenuOpen(false);
  };

  // Theme toggle visual feedback
  const [themeIconActive, setThemeIconActive] = useState(false);
  const handleThemeToggle = () => {
    setThemeIconActive(true);
    dispatch(setMode());
    setTimeout(() => setThemeIconActive(false), 200);
  };

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        background: `linear-gradient(90deg, ${alpha(theme.palette.background.paper, 0.98)} 80%, ${alpha(theme.palette.primary.light, 0.08)})`,
        color: theme.palette.text.primary,
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
        zIndex: 1400,
        transition: 'background 0.3s',
        borderBottom: `1.5px solid ${alpha(theme.palette.divider, 0.18)}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar disableGutters sx={{ px: isNonMobileScreens ? 6 : 2, minHeight: 64 }}>
        <FlexBetween width="100%">
          {/* Left: Logo and Search */}
          <FlexBetween gap="1.75rem">
            <Typography
              fontWeight="bold"
              fontSize="clamp(1.2rem, 2.2rem, 2.5rem)"
              color="primary"
              onClick={() => navigate("/home")}
              sx={{
                letterSpacing: 0.5,
                fontFamily: 'Montserrat, sans-serif',
                userSelect: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': {
                  color: primaryLight,
                },
              }}
            >
              SabhaTatva
            </Typography>
            {isNonMobileScreens && (
              <FlexBetween
                backgroundColor={background}
                borderRadius="9px"
                gap="1rem"
                padding="0.1rem 1.5rem"
                sx={{ boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)' }}
              >
                <InputBase placeholder="Search..." sx={{ width: 160 }} />
                <IconButton>
                  <Search />
                </IconButton>
              </FlexBetween>
            )}
          </FlexBetween>

          {/* Right: Actions */}
          <FlexBetween gap={isNonMobileScreens ? '2rem' : '1.2rem'}>
            <IconButton
              onClick={handleThemeToggle}
              sx={{
                background: themeIconActive ? alpha(primaryLight, 0.15) : 'none',
                transition: 'background 0.2s',
                borderRadius: '50%',
              }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: theme.palette.text.primary, fontSize: "25px" }} />
              )}
            </IconButton>
            <NotificationBell />
            <HelpWidget />
            {/* User menu with dropdown */}
            <Box>
              <IconButton
                onClick={handleUserMenuClick}
                sx={{
                  background: userMenuOpen ? alpha(primaryLight, 0.12) : 'none',
                  borderRadius: '50%',
                  px: 1,
                  py: 0.5,
                  transition: 'background 0.2s',
                }}
              >
                <Avatar
                  src={user.picturePath ? `http://localhost:3001/assets/${user.picturePath}` : undefined}
                  alt={user.firstName}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Typography sx={{ fontWeight: 600, mr: 0.5 }}>{user.firstName}</Typography>
                <ArrowDropDown />
              </IconButton>
              <MuiMenu
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 2, boxShadow: 3 } }}
              >
                <MuiMenuItem onClick={() => { navigate(`/profile/${user._id}`); handleUserMenuClose(); }}>
                  Profile
                </MuiMenuItem>
                <MuiMenuItem onClick={() => { dispatch(setLogout()); handleUserMenuClose(); }}>
                  Log Out
                </MuiMenuItem>
              </MuiMenu>
            </Box>
            {/* Mobile menu burger */}
            {!isNonMobileScreens && (
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                sx={{ ml: 1 }}
              >
                <Menu />
              </IconButton>
            )}
          </FlexBetween>
        </FlexBetween>
      </Toolbar>

      {/* MOBILE NAV OVERLAY */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="1500"
          maxWidth="400px"
          minWidth="240px"
          backgroundColor={background}
          boxShadow="-2px 0 16px 0 rgba(0,0,0,0.09)"
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="2rem"
            px={2}
          >
            <IconButton
              onClick={handleThemeToggle}
              sx={{
                background: themeIconActive ? alpha(primaryLight, 0.15) : 'none',
                transition: 'background 0.2s',
                borderRadius: '50%',
              }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: theme.palette.text.primary, fontSize: "25px" }} />
              )}
            </IconButton>
            <NotificationBell />
            <HelpWidget />
            {/* User menu in mobile overlay */}
            <Box>
              <IconButton
                onClick={handleUserMenuClick}
                sx={{
                  background: userMenuOpen ? alpha(primaryLight, 0.12) : 'none',
                  borderRadius: '50%',
                  px: 1,
                  py: 0.5,
                  transition: 'background 0.2s',
                }}
              >
                <Avatar
                  src={user.picturePath ? `http://localhost:3001/assets/${user.picturePath}` : undefined}
                  alt={user.firstName}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Typography sx={{ fontWeight: 600, mr: 0.5 }}>{user.firstName}</Typography>
                <ArrowDropDown />
              </IconButton>
              <MuiMenu
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 2, boxShadow: 3 } }}
              >
                <MuiMenuItem onClick={() => { navigate(`/profile/${user._id}`); handleUserMenuClose(); }}>
                  Profile
                </MuiMenuItem>
                <MuiMenuItem onClick={() => { dispatch(setLogout()); handleUserMenuClose(); }}>
                  Log Out
                </MuiMenuItem>
              </MuiMenu>
            </Box>
          </FlexBetween>
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;

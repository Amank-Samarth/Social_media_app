import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import ExplorePage from "scenes/ExplorePage";
import NotificationsPage from "scenes/NotificationsPage";
import MessagesPage from "scenes/MessagesPage";
import BookmarksPage from "scenes/BookmarksPage";
import ConnectionsPage from "scenes/ConnectionsPage";
import CommunitiesPage from "scenes/CommunitiesPage";
import TrendingPage from "scenes/TrendingPage";
import JobsPage from "scenes/JobsPage";
import AnalyticsPage from "scenes/AnalyticsPage";
import SettingsPage from "scenes/SettingsPage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route path="/explore" element={isAuth ? <ExplorePage /> : <Navigate to="/" />} />
            <Route path="/notifications" element={isAuth ? <NotificationsPage /> : <Navigate to="/" />} />
            <Route path="/messages" element={isAuth ? <MessagesPage /> : <Navigate to="/" />} />
            <Route path="/bookmarks" element={isAuth ? <BookmarksPage /> : <Navigate to="/" />} />
            <Route path="/connections" element={isAuth ? <ConnectionsPage /> : <Navigate to="/" />} />
            <Route path="/communities" element={isAuth ? <CommunitiesPage /> : <Navigate to="/" />} />
            <Route path="/trending" element={isAuth ? <TrendingPage /> : <Navigate to="/" />} />
            <Route path="/jobs" element={isAuth ? <JobsPage /> : <Navigate to="/" />} />
            <Route path="/analytics" element={isAuth ? <AnalyticsPage /> : <Navigate to="/" />} />
            <Route path="/settings" element={isAuth ? <SettingsPage /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

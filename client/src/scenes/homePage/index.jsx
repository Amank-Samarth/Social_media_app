import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import Sidebar from "components/Sidebar";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Box>
      {/* Sticky Navbar/Header */}
      <Box position="sticky" top={0} zIndex={1301}>
        <Navbar />
      </Box>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        {/* Sticky Sidebar: Twitter/LinkedIn-style left panel */}
        {isNonMobileScreens && (
          <Box flexBasis="26%" position="sticky" top="88px" zIndex={1200} maxHeight="calc(100vh - 88px)" sx={{ overflowY: 'auto' }}>
            <Sidebar />
          </Box>
        )}
        {/* Main Feed: Posts */}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          sx={{ minHeight: 0, maxHeight: isNonMobileScreens ? 'calc(100vh - 88px)' : 'auto', overflowY: isNonMobileScreens ? 'auto' : 'visible' }}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        {/* Sticky Right panel remains unchanged */}
        {isNonMobileScreens && (
          <Box flexBasis="26%" position="sticky" top="88px" zIndex={1200} maxHeight="calc(100vh - 88px)" sx={{ overflowY: 'auto' }}>
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;

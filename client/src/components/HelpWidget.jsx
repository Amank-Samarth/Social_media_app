import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Popover,
  List,
  ListItem,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Help,
  ExpandMore,
  Person,
  Image,
  Message,
  Settings,
  Security,
  Notifications,
} from "@mui/icons-material";

const helpTopics = [
  {
    title: "Profile Management",
    icon: <Person />,
    items: [
      {
        question: "How do I edit my profile?",
        answer:
          "Click on your profile picture or name, then click the edit icon (pencil) to modify your profile information including name, location, and occupation.",
      },
      {
        question: "How do I change my profile picture?",
        answer:
          "When editing your profile, click on the 'Add or Change Profile Picture' area to upload a new image.",
      },
    ],
  },
  {
    title: "Posts & Media",
    icon: <Image />,
    items: [
      {
        question: "How do I create a post?",
        answer:
          "Use the 'What's on your mind...' box at the top of your feed. You can add text and images to your post.",
      },
      {
        question: "Who can see my posts?",
        answer: "Currently, all posts are public and can be seen by any user on the platform.",
      },
    ],
  },
  {
    title: "Messages",
    icon: <Message />,
    items: [
      {
        question: "How do I send a message?",
        answer:
          "Click the message icon in the top bar, select a user from your conversations or start a new one, then type your message and press enter or click send.",
      },
      {
        question: "Can I delete messages?",
        answer: "Currently, messages cannot be deleted once sent.",
      },
    ],
  },
  {
    title: "Notifications",
    icon: <Notifications />,
    items: [
      {
        question: "What notifications will I receive?",
        answer:
          "You'll receive notifications when someone likes your post, comments on your post, or sends you a friend request.",
      },
      {
        question: "How do I manage notifications?",
        answer:
          "Click the notification bell icon to view all notifications. Click on a notification to mark it as read.",
      },
    ],
  },
  {
    title: "Privacy & Security",
    icon: <Security />,
    items: [
      {
        question: "How secure is my data?",
        answer:
          "We use industry-standard security measures to protect your data. Your password is encrypted, and personal information is only shared according to our privacy policy.",
      },
      {
        question: "Who can see my profile?",
        answer:
          "Your basic profile information is visible to all users. However, detailed information is only visible to your friends.",
      },
    ],
  },
  {
    title: "Account Settings",
    icon: <Settings />,
    items: [
      {
        question: "How do I change my password?",
        answer: "Currently, password change functionality is under development.",
      },
      {
        question: "Can I deactivate my account?",
        answer:
          "Account deactivation is not currently supported. Please contact support for assistance.",
      },
    ],
  },
];

const HelpWidget = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  // Toggle popover open/close on click
  const handleIconClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleIconClick}>
        <Help sx={{ fontSize: "25px" }} />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          p={2}
          sx={{
            width: 400,
            maxHeight: 600,
            overflow: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Help Center
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Find answers to common questions and learn how to use all features of our platform.
          </Typography>
          <Divider sx={{ my: 2 }} />
          {helpTopics.map((topic, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {topic.icon}
                  <Typography>{topic.title}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List disablePadding>
                  {topic.items.map((item, i) => (
                    <ListItem key={i} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                      <Typography variant="subtitle1" color="primary">
                        {item.question}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.answer}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default HelpWidget;

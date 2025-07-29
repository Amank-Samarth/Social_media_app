import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  notifications: [],
  messages: [],
  unreadNotifications: 0,
  unreadMessages: 0,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.posts = [];
      state.notifications = [];
      state.messages = [];
      state.unreadNotifications = 0;
      state.unreadMessages = 0;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload.notifications;
      state.unreadNotifications = action.payload.notifications.filter(n => !n.read).length;
    },
    setMessages: (state, action) => {
      state.messages = action.payload.messages;
      state.unreadMessages = action.payload.messages.filter(m => !m.read).length;
    },
    markNotificationRead: (state, action) => {
      const notificationId = action.payload.notificationId;
      const notification = state.notifications.find(n => n._id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadNotifications = Math.max(0, state.unreadNotifications - 1);
      }
    },
    markMessageRead: (state, action) => {
      const messageId = action.payload.messageId;
      const message = state.messages.find(m => m._id === messageId);
      if (message && !message.read) {
        message.read = true;
        state.unreadMessages = Math.max(0, state.unreadMessages - 1);
      }
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload.notification);
      if (!action.payload.notification.read) {
        state.unreadNotifications += 1;
      }
    },
    addMessage: (state, action) => {
      state.messages.unshift(action.payload.message);
      if (!action.payload.message.read) {
        state.unreadMessages += 1;
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post._id !== action.payload.postId);
    }
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setNotifications,
  setMessages,
  markNotificationRead,
  markMessageRead,
  addNotification,
  addMessage,
  deletePost
} = authSlice.actions;
export default authSlice.reducer;

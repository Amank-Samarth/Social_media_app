const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorDetails;
    try {
      errorDetails = JSON.parse(errorText);
    } catch {
      errorDetails = { message: errorText || 'Something went wrong' };
    }
    throw new Error(errorDetails.message);
  }
  return response.json();
};

export const makeRequest = async (endpoint, options = {}) => {
  try {
    // Multiple token retrieval methods
    const token = 
      localStorage.getItem('token') || 
      (window.store && window.store.getState().token) || 
      (window.localStorage && window.localStorage.getItem('token'));
    
    console.log('API Request Token Debug:', {
      endpoint,
      method: options.method || 'GET',
      tokenSource: token ? 
        (localStorage.getItem('token') ? 'localStorage' : 
        (window.store ? 'Redux' : 'window.localStorage')) : 
        'No token found',
      tokenPresence: token ? 'Present' : 'Missing'
    });

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Optional token handling - don't require token for GET requests
    if (token && options.method !== 'GET') {
      headers.Authorization = `Bearer ${token}`;
    }

    const fullUrl = endpoint.startsWith('http') ? endpoint : `http://localhost:3001${endpoint}`;
    
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // Log response status for debugging
    console.log('API Response Debug:', {
      endpoint,
      status: response.status,
      statusText: response.statusText
    });

    return handleResponse(response);
  } catch (error) {
    console.error('API Request Error:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export const uploadFile = async (endpoint, formData, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: formData,
      ...options,
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
};

// Post Interaction APIs
export const postApis = {
  likePost: (postId, userId) => {
    return makeRequest(`/posts/${postId}/like`, { 
      method: 'PATCH',
      body: JSON.stringify({ userId: userId || localStorage.getItem('userId') || '' })
    });
  },
  
  dislikePost: (postId, userId) => {
    return makeRequest(`/posts/${postId}/dislike`, { 
      method: 'PATCH',
      body: JSON.stringify({ userId: userId || localStorage.getItem('userId') || '' })
    });
  },
  
  getFeedPosts: () => makeRequest('/posts', { method: 'GET' }),
  
  createPost: (postData) => makeRequest('/posts', { 
    method: 'POST', 
    body: JSON.stringify(postData) 
  }),
  
  editPost: (postId, description) => makeRequest(`/posts/${postId}`, { 
    method: 'PATCH', 
    body: JSON.stringify({ description }) 
  }),
  
  deletePost: (postId) => makeRequest(`/posts/${postId}`, { method: 'DELETE' }),
  
  addComment: (postId, commentData) => {
    const userId = localStorage.getItem('userId');
    return makeRequest(`/posts/${postId}/comment`, { 
      method: 'POST', 
      body: JSON.stringify({
        ...commentData,
        userId: commentData.userId || userId || ''
      }) 
    });
  },
  
  updateComment: (postId, commentId, data) => makeRequest(`/posts/${postId}/comment/${commentId}`, { 
    method: 'PATCH', 
    body: JSON.stringify(data), 
    headers: { 'Content-Type': 'application/json' },
  }),
  
  deleteComment: (postId, commentId) => makeRequest(`/posts/${postId}/comment/${commentId}`, { 
    method: 'DELETE' 
  }),
  
  likeComment: (postId, commentId, userId) => {
    userId = userId || localStorage.getItem('userId');
    return makeRequest(`/posts/${postId}/comment/${commentId}/like`, { 
      method: 'PATCH',
      body: JSON.stringify({ userId: userId || '' }) 
    });
  },
  
  dislikeComment: (postId, commentId, userId) => {
    userId = userId || localStorage.getItem('userId');
    return makeRequest(`/posts/${postId}/comment/${commentId}/dislike`, { 
      method: 'PATCH',
      body: JSON.stringify({ userId: userId || '' }) 
    });
  },
  
  getPostAndIncrementViews: (postId) => makeRequest(`/posts/${postId}`, { method: 'GET' }),
};

// User Friend Management
export const userApis = {
  toggleFriend: async (friendId) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await makeRequest(`/users/${userId}/friends/${friendId}`, {
        method: 'PATCH'
      });
      return response;
    } catch (error) {
      console.error('Toggle Friend Error:', error);
      throw error;
    }
  },
};

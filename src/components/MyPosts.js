import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {  // Check if user is not null
      const fetchPosts = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/posts/user/${user.id}`);
          setPosts(response.data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchPosts();
    }
  }, [user]);  // Add user as a dependency

  return (
    <div>
      <h1>My Posts</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <small>Last updated: {new Date(post.updatedDate).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
};

export default MyPosts;
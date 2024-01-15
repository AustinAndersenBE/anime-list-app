import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const FollowingPage = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const { user } = useSelector(state => state.auth);

  // Function to fetch the list of following users
  const fetchFollowing = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users/following`, { withCredentials: true }); 
      setFollowing(response.data);
    } catch (error) {
      console.error('Error fetching following list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_BASE_URL}/users/follow`, {
        usernameToFollow: data.username,
        userId: user.id
      }, { withCredentials: true });
      fetchFollowing();
      reset();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="following-container">
      <h1>Following:</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="follow-form">
        <input {...register("username")} placeholder="Enter username" />
        <button type="submit">Add Following</button>
      </form>
      {following.map(followedUser => (
        <div key={followedUser.id} className="following-item">
          <h2>{followedUser.username}</h2>
          <Link to={`/public-users/${followedUser.id}/favorites`}>View Favorites</Link>
          <Link to={`/public-users/${followedUser.id}/posts`}>View Posts</Link>
        </div>
      ))}
    </div>
  );
};

export default FollowingPage;

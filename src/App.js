import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from '../src/store/slices/authSlice';
import './App.css';

import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import AiringAnime from './components/AiringAnime';
import FavoritesPage from './components/FavoritesPage';
import PostForm from './components/PostForm';
import MyPosts from './components/MyPosts';
import FollowingPage from './components/FollowingPage';
import PublicFavoritesPage from './components/PublicFavoritesPage';
import PublicPostsPage from './components/PublicPostsPage'; 

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Router>
      <div className="app">
        <Header />
        <SearchBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/airing-anime" element={<AiringAnime />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/post-form" element={<PostForm />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/following" element={<FollowingPage />} />
          <Route path="/public-users/:userId/favorites" element={<PublicFavoritesPage />} />
          <Route path="/public-users/:userId/posts" element={<PublicPostsPage />} /> {/* New Route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
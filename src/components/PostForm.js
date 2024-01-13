import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import * as Yup from 'yup';

const postSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  content: Yup.string()
    .required('Content is required')
    .min(10, 'Content must be at least 10 characters'),
});

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PostForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: '',
      content: ''
    }
  });

  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (location.state && location.state.title) {
      setValue('title', location.state.title);
    }
  }, [location, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/posts`, {
        ...data,
        userId: user.id,
      });
      console.log(response.data);
      navigate('/my-posts');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Title
        <input type="text" name="title" {...register('title')} />
        {errors.title && <p>{errors.title.message}</p>}
      </label>

      <label>
        Content
        <textarea name="content" {...register('content')} />
        {errors.content && <p>{errors.content.message}</p>}
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default PostForm;
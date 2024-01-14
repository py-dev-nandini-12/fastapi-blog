import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [postIdToRead, setPostIdToRead] = useState('');
  const [readPost, setReadPost] = useState(null);


  const handleSavePost = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/save_post', newPost);
      console.log('Post saved successfully:', newPost);
      setNewPost({ title: '', content: '' });
      alert('Post saved successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    }
  };

  const handleReadPost = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/read_post/${postIdToRead}`);
      console.log('Read post:', response.data);
      setReadPost(response.data);
    } catch (error) {
      console.error('Error reading post:', error);
      alert('Error reading post. Please try again.');
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/delete_post/${postIdToDelete}`);
      console.log('Post deleted successfully:', postIdToDelete);
      setPostIdToDelete('');
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post. Please try again.');
    }
  };


  return (
  <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // Ensures that the card is at least as tall as the viewport
        color: 'white'
      }}
    >
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '16px',justifyContent: 'center', maxWidth: '600px',alignItems:'center', background:'darkblue'}}>
    <div className="card">
      <div className="card-body">
        <h2 className="card-title" style={{ textAlign: 'center' }}>Blog Posts</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <button onClick={() => handleReadPost(post.id)}>Read Post</button>
            </li>
          ))}
        </ul>
        <div>
          <h2>Save Post</h2>
          <label>Title: </label>
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <br /><br />
          <label>Content: </label>
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <br />
          <button onClick={handleSavePost}>Save Post</button>
        </div>
        <div>
          <h2>Read Post</h2>
          <label>Enter post ID to read: </label>
          <input
            type="text"
            value={postIdToRead}
            onChange={(e) => setPostIdToRead(e.target.value)}
          />
          <button onClick={handleReadPost}>Read Post</button>
          {readPost && (
            <div>
              <h3>{readPost.title}</h3>
              <p>{readPost.content}</p>
            </div>
          )}
        </div>
        <div>
          <h2>Delete Post</h2>
          <label>Enter post ID to delete: </label>
          <input
            type="text"
            value={postIdToDelete}
            onChange={(e) => setPostIdToDelete(e.target.value)}
          />
          <button onClick={handleDeletePost}>Delete Post</button>
        </div>
      </div>
    </div>
   </div>
   </div>
  );
};

export default PostList;

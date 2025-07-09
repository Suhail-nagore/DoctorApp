import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '@/common/axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate function

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      const response = await api.post('/login', {
        username,
        password,
      });

      // Save both token and operator username in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('operatorName', username);

      // Redirect to the home page
      navigate('/');
    } catch (err) {
      // Handle error
      setError('Invalid credentials or server error');
      console.error('Login failed', err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0">
      <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
        <div
          className="hidden md:block lg:w-1/2 bg-cover bg-blue-700"
          style={{
            backgroundImage: 'url(/bg.webp)',
          }}
        ></div>

        <div className="w-full p-8 lg:w-1/2">
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          <form onSubmit={handleLogin} className="mt-4">
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mt-4 flex flex-col justify-between">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
              </div>
              <input
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
              >
                Login
              </button>
            </div>
            <div className="mt-4 flex items-center w-full text-center">
            <a
              href="/admin/login"
              className="text-xs text-gray-500 capitalize text-center w-full"
            >
              
              <span className="text-blue-700"> Admin Login</span>
            </a>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

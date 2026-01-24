import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { NavBar } from './NavBar';
import Footer from './Footer';
import { toast, ToastContainer } from 'react-toastify';
import { useUser } from './UserContext';

export const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const {setUser}=useUser();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.warning("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        'https://berry-amc-0kaq.onrender.com/api/login',
        { email, password },
        { withCredentials: true }
      );
      
      setUser(res.data.user)
      toast.success(res.data.message);
      
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="min-h-screen md:pt-20 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6">Login</h2>

          <label className='font-medium text-[17.5px]'>Email</label>
          <input
            type="email"
            placeholder="Enter your email..."
            className="w-full mb-6 px-2 py-2 border-b-1 focus:outline-none mt-1 placeholder:italic"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className='font-medium text-[17.5px]'>Password</label>
          <div className='w-full flex'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password..."
              className="w-full mb-3 px-2 py-2 border-b-1 focus:outline-none mt-1 placeholder:italic"
              onChange={(e) => setPassword(e.target.value)}
            />
            {password && (
              !showPassword ? (
                <IoEyeOff
                  className='text-2xl mt-2.5 cursor-pointer'
                  onClick={() => setShowPassword(true)}
                />
              ) : (
                <IoEye
                  className='text-2xl mt-2.5 cursor-pointer'
                  onClick={() => setShowPassword(false)}
                />
              )
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full ${loading ? 'bg-violet-400' : 'bg-violet-600 hover:bg-violet-700'} text-white py-2 rounded mt-2 mb-2 font-semibold transition-all`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className='text-center font-medium mb-1'>
              <span onClick={() => navigate("/forgot-password")} className='text-blue-600 ml-1 cursor-pointer hover:text-blue-700'>
                Forgot password?
              </span>
          </p>

          <p className='text-center font-medium'>
            Don't have an account?
            <span
              onClick={() => navigate("/user/signup")}
              className='text-blue-600 ml-1 hover:underline cursor-pointer'
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

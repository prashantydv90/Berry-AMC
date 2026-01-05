


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NavBar } from './NavBar';
import { IoEye, IoEyeOff } from "react-icons/io5";
import Footer from './Footer';
import { toast, ToastContainer } from 'react-toastify';
import { useUser } from './UserContext';

export const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', rePassword: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false); // for disabling button

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password || !form.rePassword) {
      toast.warning("Please fill all fields");
      return;
    }
    if (form.password !== form.rePassword) {
      toast.warning("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5555/api/signup', form);
      if (res.data.success) {
        setOtpSent(true);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.warning("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5555/api/signup/verify-otp',
        { email: form.email, otp }
      );

      toast.success(res.data.message);

      // auto-login after OTP success
      const loginResult = await handleLogin();

      if (loginResult.success) {
        navigate("/client/registration");
      } else {
        navigate("/user/login");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };




  const { setUser } = useUser();

  const handleLogin = async () => {
    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      toast.warning("Please enter both email and password");
      return { success: false };
    }

    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5555/api/login',
        { email, password },
        { withCredentials: true }
      );

      setUser(res.data.user);
      return { success: true };

    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <NavBar />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="min-h-screen md:pt-20 flex items-center justify-center px-4 mb-10">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6">Sign Up</h2>

          {!otpSent ? (
            <>
              <label className='font-medium text-[17.5px]'>Name</label>
              <input
                type="text"
                name='name'
                placeholder="Enter your name..."
                className="w-full mb-4 px-2 pt-1.5 pb-2 border-b focus:outline-none placeholder:italic"
                value={form.name}
                onChange={handleChange}
              />

              <label className='font-medium text-[17.5px]'>Email</label>
              <input
                type="email"
                name='email'
                placeholder="Enter your email..."
                className="w-full mb-4 px-2 pt-1.5 pb-2 border-b focus:outline-none placeholder:italic"
                value={form.email}
                onChange={handleChange}
              />

              <label className='font-medium text-[17.5px]'>Password</label>
              <input
                type="password"
                name='password'
                placeholder="Enter your password..."
                className="w-full mb-4 px-2 pt-1.5 pb-2 border-b focus:outline-none placeholder:italic"
                value={form.password}
                onChange={handleChange}
              />

              <label className='font-medium text-[17.5px]'>Confirm Password</label>
              <div className='w-full flex'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='rePassword'
                  placeholder="Re-Enter your password..."
                  className="w-full mb-4 px-2 pt-1.5 pb-2 border-b focus:outline-none placeholder:italic"
                  value={form.rePassword}
                  onChange={handleChange}
                />
                {form.rePassword && (
                  !showPassword ? (
                    <IoEyeOff className='text-2xl mt-1 cursor-pointer' onClick={() => setShowPassword(true)} />
                  ) : (
                    <IoEye className='text-2xl mt-1 cursor-pointer' onClick={() => setShowPassword(false)} />
                  )
                )}
              </div>

              <button
                onClick={handleSignup}
                disabled={loading}
                className={`w-full text-white py-2 rounded mt-2 mb-4 font-semibold cursor-pointer transition-all
                  ${loading ? 'bg-violet-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'}`}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </>
          ) : (
            <>
              <label className='font-medium text-[17.5px]'>Enter OTP</label>
              <input
                type="text"
                placeholder="Enter OTP..."
                className="w-full mb-4 px-2 pt-1.5 pb-2 border-b focus:outline-none placeholder:italic"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className={`w-full text-white py-2 rounded mt-2 mb-4 font-semibold cursor-pointer transition-all
                  ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </>
          )}

          {!otpSent && (
            <>
            <p className='text-center font-medium mb-1'>
              <span onClick={() => navigate("/forgot-password")} className='text-blue-600 ml-1 cursor-pointer hover:text-blue-700'>
                Forgot password?
              </span>
            </p>
            <p className='text-center font-medium'>Already have an account?
              <span onClick={() => navigate("/user/login")} className='text-blue-600 ml-1 hover:underline cursor-pointer'>
                Login
              </span>
            </p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};


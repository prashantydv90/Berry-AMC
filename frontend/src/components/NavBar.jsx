



import { Menu, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useUser } from './UserContext';
import axios from 'axios';

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Check if user is logged in (example: stored in localStorage)

  const { user, setUser } = useUser();
  const handleLogout = () => {
    axios.get('https://berry-amc-0kaq.onrender.com/api/logout', { withCredentials: true }).then((res) => {
      console.log(res);
      setUser(null);
      toast.success(res.data.message)
      setTimeout(() => navigate("/user/login"), 100);
    }).catch((err) => {
      console.log("error in logout", err);
    })
  };



  return (
    <header className="fixed flex  items-center z-50 px-6 md:px-12 2xl:px-25 py-4 shadow-md bg-white w-screen">
      {/* Logo */}
      <div className="text-2xl w-1/4 font-bold flex">
        <span className="text-blue-600">BERRY</span> AMC
      </div>

      {/* Desktop Nav */}
      {/* <nav className="hidden md:flex gap-8 md:w-1/2 md:justify-center  text-gray-600 font-medium">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/services" className="hover:text-blue-600">Our Services</Link>
        <Link to="/user-dashboard" className="hover:text-blue-600">Dashboard</Link>
        <Link to="/contact-us" className="hover:text-blue-600">Contact Us</Link>
      </nav> */}


      <nav className="hidden md:flex gap-8 md:w-1/2 md:justify-center text-gray-600 font-medium">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-blue-600" : "hover:text-blue-600"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) =>
            isActive ? "text-blue-600" : "hover:text-blue-600"
          }
        >
          Our Services
        </NavLink>

        <NavLink
          to="/user-dashboard"
          className={({ isActive }) =>
            isActive ? "text-blue-600" : "hover:text-blue-600"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/market"
          className={({ isActive }) =>
            isActive ? "text-blue-600" : "hover:text-blue-600"
          }
        >
          Market
        </NavLink>

        <NavLink
          to="/contact-us"
          className={({ isActive }) =>
            isActive ? "text-blue-600" : "hover:text-blue-600"
          }
        >
          Contact Us
        </NavLink>
      </nav>


      {/* Right Section (Desktop) */}
      <div className="hidden md:flex md:w-1/4 md:justify-end items-center gap-4">
        {!user ? (
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700"
            onClick={() => navigate('/user/signup')}
          >
            Sign In
          </button>
        ) : (
          <div className="relative group">
            {/* Avatar circle */}
            <div
              className="w-10 h-10 text-xl rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold cursor-pointer select-none"
              title={user.name}
            >
              {user.name?.[0]?.toUpperCase()}
            </div>

            {/* Dropdown */}
            <div
              className="
          absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-md 
          opacity-0 invisible group-hover:visible group-hover:opacity-100
          transition-all duration-200 z-50
        "
            >
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                onClick={handleLogout}
              >
                Logout
              </button>

              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                onClick={() => navigate('/forgot-password')}
              >
                Change Password
              </button>

              {user?.role === "admin" && (
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => navigate('/admin')}
                >
                  Admin Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex flex-1 justify-end text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-4 md:hidden z-50">
          <Link to="/" className="hover:text-blue-600 font-medium py-2 text-gray-700">Home</Link>
          <Link to="/services" className="hover:text-blue-600 font-medium py-2 text-gray-700">Our Services</Link>
          <Link to="/user-dashboard" className="hover:text-blue-600 font-medium py-2 text-gray-700">Dashboard</Link>
          <Link to="/user-dashboard" className="hover:text-blue-600 font-medium py-2 text-gray-700">Market</Link>
          <Link to="/contact-us" className="hover:text-blue-600 font-medium py-2 text-gray-700">Contact Us</Link>

          {!user ? (
            <button
              className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700"
              onClick={() => {
                setMenuOpen(false);
                navigate('/user/signup');
              }}
            >
              Sign In
            </button>
          ) : (
            <div className="flex flex-col items-center mt-3 gap-2">
              {/* <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <button
                className="text-gray-700 hover:text-blue-600"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/user/profile');
                }}
              >
                Profile
              </button> */}
              <button
                className="text-gray-700 font-medium px-8 py-1 outline-1 rounded-[10px] hover:text-red-600"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};





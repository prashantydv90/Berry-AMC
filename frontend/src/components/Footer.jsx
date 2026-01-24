import React from "react";
import { FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6 md:px-12 ">
      <div className="max-w-7xl mx-auto  grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-20 2xl:gap-40">
        
        {/* About Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">About Us</h2>
          <p className="text-sm">
            We help clients grow their wealth through smart investments, 
            risk management, and personalized financial strategies. 
            Your financial growth is our priority.
          </p>
        </div>

        {/* Services Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Services</h2>
          <ul className="space-y-2 text-sm">
            <li>Wealth Management</li>
            <li>Risk Management</li>
            <li>Mutual Fund</li>
            <li>Fixed Deposits</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/services" className="hover:text-white">Services</a></li>
            <li><a href="/user-dashboard" className="hover:text-white">Dashboard</a></li>
            <li><a href="/contact-us" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
          <p className="text-sm">📍 IIT Jammu, India</p>
          <p className="text-sm">📞 +91 9471433780</p>
          <p className="text-sm">✉️ support@berryamc.in</p>

          {/* Social Links */}
          <div className="flex space-x-4 mt-4">
            <a 
              href="https://www.linkedin.com/company/berry-amc/?viewAsMember=true" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white text-2xl"
            >
              <FaLinkedin />
            </a>
            <a 
              href="https://www.instagram.com/berry.amc?igsh=N3Vrbmw1djl0aTJ0" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white text-2xl"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-700 pt-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} BerryAMC. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

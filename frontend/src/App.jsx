



import { useEffect, useState } from 'react'
import HomePage from './components/Home'

import { DashBoard } from './components/DashBoard'
import { AdminHome } from './components/Admin/AdminHome'
import { ClientDetails } from './components/Admin/ClientDetails'
import { Services } from './components/Services'
import { Routes, Route, useLocation } from "react-router-dom";
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import { AddClientForm } from './components/Admin/AddClient'
import { ContactForm } from './components/ContactUs'
import { ClientRequestForm } from './components/ClientReqForm'
import ClientRequestsPage from './components/Admin/ClientReq'
import { AdminRoute } from './components/AdminRoute'
import { ForgotPassword } from './components/ForgotPassword'
import { ResetPassword } from './components/ResetPassword'
import NProgress from './components/progressBar'
import "./index.css";
import ScrollToTop from './components/ScrollToTop'
import { Buyback } from './components/Market/Buyback'





function App() {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 200); // how long progress bar stays visible

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user-dashboard" element={<DashBoard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact-us" element={<ContactForm />} />

        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/client/registration" element={<ClientRequestForm />} />

        <Route path="/admin" element={<AdminRoute element={AdminHome} />} />
        <Route path="/admin/view/:id" element={<AdminRoute element={ClientDetails} />} />
        <Route path="/admin/addclient" element={<AdminRoute element={AddClientForm} />} />
        <Route path="/admin/client-requests" element={<AdminRoute element={ClientRequestsPage} />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/market/buyback" element={<Buyback/>} />

      </Routes>
    </>
  )
}

export default App


import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/BAMClogo.png"
import man from "../assets/man.avif"
import Abhishek from "../assets/Abhishek.png"
import Vedant from "../assets/Vedant.png"
import Umang from "../assets/Umang.png"
import Vivek from "../assets/Vivek.png"
import { NavBar } from "./NavBar";
import { Wallet, PieChart, FileText } from "lucide-react"; // lucide icons
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";




export default function HomePage() {
  let navigate=useNavigate();

  const team = [
    {
      name: "Abhishek ",
      role: "Founder",
      img: Abhishek, // replace with actual image
    },
    // {
    //   name: "Vivek ",
    //   role: "Co-Founder",
    //   img: Vivek,
    // },
    {
      name: "Umang ",
      role: "CEO",
      img: Umang,
    },
    {
      name: "Vedant ",
      role: "CFO",
      img: Vedant,
    },

  ];
  return (
    <div className="min-h-screen bg-zinc-50 w-full ">
      {/* Navbar */}
      <NavBar />

      {/* Hero Section */}
      <div className="flex flex-col  md:flex-row items-center justify-between px-6 md:px-12 2xl:px-25 pt-30 w-full  ">
        {/* Left Side */}
<div className="max-w-lg space-y-6  ">
  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
    Elevate Your Financial Future with{" "}
    <span className="text-blue-600">Berry AMC</span>
  </h1>
  <p className="text-gray-600 text-lg">
    We understand that managing your wealth is about more than just
    numbers. It's about securing your future, achieving your dreams, and
    leaving a legacy.
  </p>
  <div className="flex gap-4 ">
    <button className="bg-blue-600 text-white cursor-pointer px-5 py-3 rounded-md font-medium hover:bg-blue-700"
    onClick={()=>navigate('/services')}>
      Our Services
    </button>
    <button className="bg-gray-200 text-gray-800 cursor-pointer px-5 py-3 rounded-md font-medium hover:bg-gray-300"
    onClick={()=>navigate('/contact-us')}>
      Contact Us
    </button>
  </div>
</div>

        {/* Right Side Illustration */}
        <div className="mt-12 md:mt-0">
          {/* <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg px-12 py-16 flex items-center justify-center text-center text-2xl font-semibold w-80 h-64">
            📈 Wealth Management Simplified
          </div> */}
          <img className="md:h-[20rem] mr-20" src={logo} alt="" />
        </div>
      </div>

      {/* About us */}
      <div className="w-full mt-15  py-10  flex flex-wrap md:px-12 px-6 2xl:px-25  ">
        <div className="md:w-1/2 ">
          <h2 className="text-3xl text-center md:text-start font-bold text-gray-800 mb-4">About Us</h2>
          <p className="text-gray-600 text-center md:text-start font-medium max-w-2xl">
            Berry AMC is founded and managed by Abhishek, Umang and Vedant. All are undergraduate students at IIT Jammu.<br></br>

            We believe that our youth and academic background provide us with a unique
            advantage, allowing us to approach problems with fresh ideas and a relentless
            drive to succeed.<br></br>

            Our mission is to deliver top-notch services in asset management, as we continue
            to grow and evolve. Join us on our journey as we strive to make a positive
            difference in the world of finance.
          </p>
        </div>

        <div className="flex md:flex-1 flex-wrap  justify-center mx-5 md:mx-0 md:ml-10 mt-18 md:mt-12  gap-6 ">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center w-24 md:w-28"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border border-gray-200"
              />
              <h4 className="text-sm md:text-base font-medium text-gray-800 mt-2">
                {member.name}
              </h4>
              <p className="text-xs text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </div>





      <div className="mx-10 flex flex-col mt-18 items-center mb-20  2xl:px-13 3xl:px-200 ">
        <h1 className="font-bold text-4xl">Our Services</h1>
        <Services />
      </div>

      <Footer />


    </div>
  );
}











function Services() {
  let navigate=useNavigate();
  const services = [
    {
      icon: <Wallet className="w-8 h-8 text-blue-600" />,
      title: "Wealth Management",
      desc: `Maximize your wealth with our tailored strategies, including our "No Loss" assurance on investments.`
    },
    {
      icon: <PieChart className="w-8 h-8 text-blue-600" />,
      title: "Portfolio Management",
      desc: `Customized investment plans designed to meet your risk tolerance and financial objectives.`
    },
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "Financial Planning",
      desc: `Comprehensive analysis and strategic solutions to secure your financial future and retirement.`
    },
  ];
  return (
    <div className="w-full pt-10 pd-12 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-10">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-lg border hover:scale-105 duration-300  border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-4">
              {service.icon}
              <h3 className="text-xl font-bold text-blue-600">
                {service.title}
              </h3>
            </div>
            <div className="space-y-2 text-gray-600 font-medium">
              {service.desc}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center mt-20">
        <div className="px-7 py-2 bg-blue-600 rounded-md text-white font-medium shadow-md hover:bg-blue-700 cursor-pointer" onClick={()=>navigate('/services')}>Learn More</div>
      </div>
    </div>
  );
}










// export default function HomePage() {
//   return (
//     <div className="w-full">
//       <NavBar />

//       <div className="w-full bg-zinc-50  min-h-screen">
//         <div className="h-screen md:flex md:flex-row flex-col w-full ">
//           <div className="md:w-1/2 pt-18  md:min-h-screen h-1/2 flex flex=col items-center px-6 md:px-12">
//             <div className="max-w-lg space-y-6 bg-amber-100">
//               <h1 className="text-4xl md:text-5xl  font-extrabold text-gray-900 leading-tight">
//                 Elevate Your Financial Future with{" "}
//                 <span className="text-blue-600">Berry AMC</span>
//               </h1>
//               <p className="text-gray-600 text-lg">
//                 We understand that managing your wealth is about more than just
//                 numbers. It's about securing your future, achieving your dreams, and
//                 leaving a legacy.
//               </p>
//               <div className="flex gap-4 ">
//                 <button className="bg-blue-600 text-white cursor-pointer px-5 py-3 rounded-md font-medium hover:bg-blue-700"
//                   onClick={() => navigate('/services')}>
//                   Our Services
//                 </button>
//                 <button className="bg-gray-200 text-gray-800 cursor-pointer px-5 py-3 rounded-md font-medium hover:bg-gray-300"
//                   onClick={() => navigate('/contact-us')}>
//                   Contact Us
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="md:w-1/2 bg-amber-600 md:min-h-screen h-1/2">h</div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   )
// }



import React, { useEffect, useState } from "react";
import { NavBar } from "../NavBar";
import { IoSearchOutline } from "react-icons/io5";
import { IdCardLanyard, User, Wallet, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import axios from "axios";
import { formatDate, toIndianFormat } from "../utils";
import { AddClientForm } from "./AddClient";

export const AdminHome = () => {
  const [showClient, setShowClient] = useState(false);
  const navigate = useNavigate();
  const [clientReq, setClientReq] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // <-- search state

  // Fetch client requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5555/api/getclientreqs",{withCredentials:true});
        setClientReq(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5555/api/getClientDetails",{withCredentials:true});
        setClients(res.data.data || []);
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // Filter clients based on search
  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.PAN?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100">
      <NavBar />
      {loading ? (
        <p className="pt-28 min-h-screen flex justify-center text-2xl font-medium">
          Loading clients...
        </p>
      ) : (
        <div className="min-h-screen pt-18 sm:pt-20 bg-zinc-100 flex-1 overflow-y-auto mb-15">
          {/* Search + Add Client */}
          <div className="mt-5 sm:flex justify-center gap-3 sm:gap-5 px-4 sm:pb-3">
            <div className="flex border border-zinc-400 rounded-md px-2 py-1 items-center">
              <input
                type="text"
                placeholder="Search Client..."
                className="outline-0 text-[14px] flex-1 mr-2"
                value={searchTerm} // controlled input
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoSearchOutline />
            </div>

            <div className="flex items-center gap-10 sm:gap-4 sm:mt-0 mt-5 mb-5 sm:mb-0">
              <div
                className="px-4 py-2 rounded-md text-[14px] font-medium bg-blue-600 text-white hover:bg-blue-700 cursor-pointer text-center"
                onClick={() => setShowClient(true)}
              >
                Add Client
              </div>

              <div
                className="relative px-4 py-2 rounded-md text-[14px] font-medium bg-zinc-300 hover:bg-zinc-400 cursor-pointer text-center ml-auto"
                onClick={() => navigate("/admin/client-requests")}
              >
                Client Requests
                <span className="absolute -top-2 -right-2 bg-zinc-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {clientReq.length}
                </span>
              </div>
            </div>
          </div>

          {/* Table Header + Rows */}
          <div className="mt-3 mx-6 md:mx-12 2xl:mx-25 overflow-x-auto">
            <div className="min-w-[800px] flex bg-blue-700 py-2 rounded-md px-4 text-white shadow-md text-sm gap-x-4">
              <div className="flex items-center gap-1 min-w-[100px] w-[15%]">
                <IdCardLanyard size={16} />PAN No.
              </div>
              <div className="flex items-center gap-1 min-w-[150px] w-[25%]">
                <User size={16} />Client Name
              </div>
              <div className="flex items-center gap-1 min-w-[120px] w-[15%]">
                <Wallet size={16} />Total Value
              </div>
              <div className="flex items-center gap-1 min-w-[120px] w-[15%]">
                <Clock size={16} className="mt-0.5" />Last Updated
              </div>
              <div className="min-w-[150px] text-center w-[30%]">Actions</div>
            </div>

            {/* Table Rows */}
            {filteredClients.map((client, idx) => (
              <div
                key={idx}
                className="min-w-[800px] flex py-3.5 rounded-md px-4 font-medium items-center bg-white shadow-md mt-3 gap-x-4"
              >
                <div className="min-w-[100px] w-[15%]">{client.PAN}</div>
                <div className="min-w-[150px] w-[25%]">{client.name}</div>
                <div className="min-w-[120px] w-[15%]">
                  ₹
                  {toIndianFormat(
                    (
                      (Number(client?.FDTotalValue) || 0) +
                      (Number(client?.MFTotalValue) || 0)
                    ).toFixed(0)
                  ) || "NA"}
                </div>
                <div className="min-w-[120px] w-[15%]">{formatDate(client.updatedAt)}</div>
                <div className="min-w-[150px] w-[30%] flex justify-center gap-3">
                  <div
                    className="px-4 py-1.5 text-[14px] rounded-md bg-green-600 hover:bg-green-700 cursor-pointer text-white"
                    onClick={() => navigate(`/admin/view/${client._id}`)}
                  >
                    View
                  </div>
                  <div className="px-3 py-1.5 text-[14px] rounded-md cursor-pointer hover:bg-red-700 bg-red-600 text-white">
                    Remove
                  </div>
                </div>
              </div>
            ))}

            {/* Show message if no results */}
            {filteredClients.length === 0 && (
              <p className="mt-5 text-center text-gray-500 font-medium">
                No clients found for "{searchTerm}"
              </p>
            )}
          </div>
        </div>
      )}
      {showClient && <AddClientForm setShowClient={setShowClient} />}
      <Footer />
    </div>
  );
};

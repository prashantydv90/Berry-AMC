import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";
import { NavBar } from "../NavBar";
import Footer from "../Footer";
import { toast, ToastContainer } from "react-toastify";

const ClientRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [actionType, setActionType] = useState(""); // approve / reject
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch requests
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5555/api/getclientreqs",{withCredentials:true});
      setRequests(res.data.data || []);
    } catch (error) {
      console.error("Error fetching client requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle approve/reject click
  const handleActionClick = (req, type) => {
    setSelectedReq(req);
    setActionType(type);
    setShowConfirm(true);
  };

  // Confirm action
  const confirmAction = async () => {
    try {
      if(actionType==='approve'){
        await axios.post('http://localhost:5555/api/addClient',selectedReq,{withCredentials:true}).then((res)=>{
            console.log(res.data.message);
        }).catch((err)=>{
            console.log(err);
        })
      }
      await axios.delete(`http://localhost:5555/api/deletereq/${selectedReq._id}`,{withCredentials:true})
      toast.success(
        actionType === "approve"
          ? "Client approved successfully!"
          : "Client request rejected!"
      );

      // Refresh list
      fetchRequests();
    } catch (error) {
      alert("Something went wrong. Try again!");
    } finally {
      setShowConfirm(false);
      setSelectedReq(null);
      setActionType("");
    }
  };

  return (
    <>
    <NavBar/>
    <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    <div className="min-h-screen bg-gray-50 pt-25 pb-10 px-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Client Requests
      </h2>

      {loading ? (
        <p className="text-center">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">No pending requests</p>
      ) : (
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white text-left">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">PAN</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr
                  key={req._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{req.name}</td>
                  <td className="py-3 px-4">{req.email}</td>
                  <td className="py-3 px-4">{req.phone}</td>
                  <td className="py-3 px-4">{req.PAN}</td>
                  <td className="py-3 px-4 flex justify-center gap-3">
                    <button
                      className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                      onClick={() => handleActionClick(req, "approve")}
                    >
                      <Check size={18} />
                    </button>
                    <button
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      onClick={() => handleActionClick(req, "reject")}
                    >
                      <X size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirm && selectedReq && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[22rem]">
            <h3 className="text-lg font-semibold mb-4">
              {actionType === "approve"
                ? "Approve this client request?"
                : "Reject this client request?"}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {selectedReq.name} ({selectedReq.email})
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-md text-white ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                onClick={confirmAction}
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default ClientRequestsPage;

import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export const AddClientForm = ({ setShowClient }) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        PAN: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/clients", formData,{withCredentials:true});
            toast.success(res.data.message);
            setFormData({ name: "", phone: "", email: "", address: "", PAN: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding client");
        }
    };

    return (
        <div className="inset-0 bg-black/50 fixed z-50 overflow-y-auto">
            <div className="bg-black/50 z-50" onClick={() => setShowClient(false)}></div>
            <div className="max-w-2xl z-70 mx-auto bg-white shadow-lg rounded-xl p-6 mt-10" >
                {/* Cross Button */}
                <button
                    type="button"
                    onClick={() => setShowClient(false)}
                    className="absolute top-3 right-3 text-black h-10  hover:text-gray-600"
                >
                    <X size={40} />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">Add Client</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {["name", "phone", "email", "address", "PAN"].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium capitalize">{field}</label>
                            <input
                                type={field === "phone" ? "number" : "text"}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 cursor-not-allowed"
                    >
                        Add Client
                    </button>
                </form>
            </div>
        </div>
    );
};



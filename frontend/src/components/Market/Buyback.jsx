
import { useEffect, useState } from "react";
import axios from "axios";
import { NavBar } from "../NavBar";
import {
  FileText,
  Search,
  RotateCw,
  Calendar,
  ChevronRight
} from "lucide-react"; // npm i lucide-react

const API_BASE = "https://berry-amc-0kaq.onrender.com/api/buybacks";
// px-3 md:px-9 pt-28 pb-10
export const Buyback = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());


  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      setData(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setTimeout(() => setLoading(false), 600); // Smooth transition
    }
  }

  const filteredData = data.filter(d =>
    d.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function toggleRow(id) {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }


  return (
    <div className=" bg-[#F8FAFC] px-1.5 pt-1">
      {/* <NavBar /> */}

      <div className="mx-auto  ">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-1">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Buyback Updates
            </h1>
            <p className="text-slate-500 text-sm">Stay updated with the latest buyback announcements</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search symbol..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full md:w-64 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={load}
              className="p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 text-slate-600 transition-all active:scale-90 shadow-sm"
            >
              <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Announcement</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Broadcast</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((d) => (
                  <tr key={d._id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center  gap-3">
                        <div>
                          <div className="font-bold text-slate-900 uppercase">{d.symbol}</div>
                          <div className="text-[13px] font-medium text-slate-500  max-w-[180px]">{d.companyName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[15px] font-medium text-slate-800 mb-1">{d.desc}</div>
                      <p
                        className={`text-[13.5px] font-medium text-slate-500 max-w-md transition-all`}
                      >
                        {d.details}
                      </p>


                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2 text-slate-600">
                        {/* <Calendar className="mt-0.5 h-3.5 w-3.5 text-slate-400" /> */}

                        <div className="leading-tight">
                          {/* DATE */}
                          <div className="text-sm font-medium">
                            {new Date(d.broadcastAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>

                          {/* TIME */}
                          <div className="text-xs font-medium text-center text-slate-500 mt-1">
                            {new Date(d.broadcastAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="md:px-6 px-4 py-4 text-center md:text-right">
                      {d.pdfUrl ? (
                        <a
                          href={d.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
        inline-flex items-center gap-2
        whitespace-nowrap
        px-4 py-2
        bg-indigo-600 text-white text-xs font-semibold
        rounded-lg
        hover:bg-indigo-700
        transition-all
        shadow-md shadow-indigo-200
        active:scale-95
      "
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>View PDF</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300 italic">No File</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simple pagination/count footer */}
        <div className="mt-6 px-2 flex items-center justify-between text-xs font-medium text-slate-500">
          <p>Showing {filteredData.length} announcements</p>
          <div className="flex gap-2">
            <span className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Live Feed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}














import { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "../utils";

/* ================= API MAP ================= */
const API_MAP = {
  Open: "/api/ipos/open",
  Upcoming: "/api/ipos/upcoming",
  Closed: "/api/ipos/closed",
};

export const Ipo = () => {
  const [activeStatus, setActiveStatus] = useState("Open");
  const [data, setData] = useState({
    Open: [],
    Upcoming: [],
    Closed: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchIpos = async () => {
      // Don’t refetch if already loaded
      if (data[activeStatus].length > 0) return;

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`https://berry-amc-0kaq.onrender.com${API_MAP[activeStatus]}`);
        console.log(res)
        setData((prev) => ({
          ...prev,
          [activeStatus]: res.data.data || [],
        }));
      } catch (err) {
        setError("Failed to fetch IPOs");
      } finally {
        setLoading(false);
      }
    };

    fetchIpos();
  }, [activeStatus]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-zinc-900 mb-6">
        IPO Dashboard
      </h2>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["Open", "Closed", "Upcoming"].map((status) => (
          <StatusPill
            key={status}
            label={status}
            active={activeStatus === status}
            onClick={() => setActiveStatus(status)}
          />
        ))}
      </div>

      {/* Content */}
      {loading && (
        <div className="text-zinc-500 py-10 text-center">
          Loading IPOs...
        </div>
      )}

      {error && (
        <div className="text-red-500 py-10 text-center">
          {error}
        </div>
      )}

      {!loading && !error && (
        <IPOTable ipos={data[activeStatus]} />
      )}
    </div>
  );
};

/* ================= STATUS PILL ================= */
const StatusPill = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all
        border border-zinc-200
        ${
          active
            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
            : "bg-white text-zinc-700 hover:bg-zinc-50"
        }
      `}
    >
      {label}
    </button>
  );
};

/* ================= TABLE ================= */
const IPOTable = ({ ipos }) => {
  if (!ipos.length) {
    return (
      <div className="text-zinc-500 py-10 text-center">
        No IPOs available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 text-zinc-600">
          <tr>
            <th className="text-left px-5 py-3 font-medium">
              IPO Name
            </th>
            <th className="text-left px-5 py-3 font-medium">
              Start Date
            </th>
            <th className="text-left px-5 py-3 font-medium">
              End Date
            </th>
            <th className="text-left px-5 py-3 font-medium">
              Price Band
            </th>
            <th className="text-left px-5 py-3 font-medium">
              Series
            </th>
            <th className="text-left px-5 py-3 font-medium">
              Overall Subscription
            </th>
          </tr>
        </thead>

        <tbody>
          {ipos.map((ipo) => (
            <tr
              key={ipo._id}
              className="border-t border-zinc-200 hover:bg-zinc-50 transition"
            >
              <td className="px-5 py-4 font-medium text-zinc-900">
                {ipo.companyName}
              </td>
              <td className="px-5 py-4 text-zinc-700 ">
                {formatDate(ipo.issueStartDate)}
              </td>
              <td className="px-5 py-4 text-zinc-700">
                {formatDate(ipo.issueEndDate)}
              </td>
              <td className="px-5 py-4 text-zinc-700">
                {ipo.priceBand}
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700">
                  {ipo.series}
                </span>
              </td>
              <td className="px-5 py-4 text-zinc-700">
                {ipo.overallSubscription || "--"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

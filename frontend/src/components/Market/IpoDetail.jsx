import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "../utils";

export const IpoDetail = () => {
  const { id } = useParams();
  const [ipo, setIpo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIpo = async () => {
      try {
        const res = await axios.get(
          `https://berry-amc-0kaq.onrender.com/api/ipos/${id}`
        );
        setIpo(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIpo();
  }, [id]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!ipo) return <div className="p-10">IPO not found</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-zinc-200 p-8">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            {ipo.companyName}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {ipo.symbol}
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-semibold text-zinc-900">
            ₹{ipo.minInvestment.toLocaleString("en-IN")}
          </div>
          <p className="text-sm text-zinc-500">
            Minimum Investment
          </p>
        </div>
      </div>

      {/* IPO DETAILS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

        <DetailItem label="Price Range">
          ₹{ipo.lowerPrice} - ₹{ipo.upperPrice}
        </DetailItem>

        <DetailItem label="Lot Size">
          {ipo.lotSize}
        </DetailItem>

        <DetailItem label="Issue Size">
          {formatToCrore(ipo.issueSize*ipo.maxInvestment)}
        </DetailItem>

        <DetailItem label="Series">
          {ipo.series}
        </DetailItem>

        <DetailItem label="Start Date">
          {formatDate(ipo.issueStartDate)}
        </DetailItem>

        <DetailItem label="End Date">
          {formatDate(ipo.issueEndDate)}
        </DetailItem>

        <DetailItem label="Status">
          {ipo.status}
        </DetailItem>

        <DetailItem label="Subscription">
          {ipo.overallSubscription || "--"}
        </DetailItem>

      </div>
    </div>
  );
};

const DetailItem = ({ label, children }) => (
  <div>
    <p className="text-sm text-zinc-500 mb-1">{label}</p>
    <p className="text-base font-medium text-zinc-900">
      {children}
    </p>
  </div>
);

function formatToCrore(num) {
  const crore = num / 10000000;

  return (
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(crore) + " Cr"
  );
}
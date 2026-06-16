import React, { useCallback, useEffect, useState } from "react";
import { Gem, Sparkles } from "lucide-react";
import { Protect, useAuth } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const getDashboardData = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }, [getToken]);

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  return (
    <div className="h-full overflow-y-scroll p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

        <div className="flex justify-start gap-4 flex-wrap mb-8">
          {/* Total Creations Card */}
          <div className="flex justify-between items-center w-72 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-slate-600">
              <p className="text-sm text-slate-400">Total Creations</p>
              <h2 className="text-2xl font-bold mt-1">{creations.length}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-6 text-white" />
            </div>
          </div>

          {/* Active Plan Card */}
          <div className="flex justify-between items-center w-72 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-slate-600">
              <p className="text-sm text-slate-400">Active Plan</p>
              <h2 className="text-2xl font-bold mt-1">
                <Protect plan="premium" fallback="Free">
                  Premium
                </Protect>
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center shadow-lg shadow-pink-500/20">
              <Gem className="w-6 text-white" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-purple-500 border-t-transparent"></div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Recent Creations</h2>
            <div className="space-y-3">
              {creations.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>No creations yet. Start generating!</p>
                </div>
              ) : (
                creations.map((item) => (
                  <CreationItem key={item.id} item={item} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useCallback, useEffect, useState } from "react";
import { Heart, Users } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchCreations = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations", {
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

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        },
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user, fetchCreations]);

  return !loading ? (
    <div className="h-full overflow-y-scroll p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3C81F6] to-[#9234EA] flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Community</h1>
            <p className="text-sm text-slate-500">Discover creations shared by the community</p>
          </div>
        </div>

        {creations.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>No published creations yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {creations.map((creation, index) => (
              <div
                key={index}
                className="relative group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={creation.content}
                  alt=""
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white rounded-2xl">
                  <p className="text-sm mb-2 line-clamp-2">{creation.prompt}</p>
                  <div className="flex gap-1 items-center">
                    <p className="text-sm font-medium">{creation.likes.length}</p>
                    <Heart
                      onClick={() => imageLikeToggle(creation.id)}
                      className={`w-5 h-5 hover:scale-110 cursor-pointer transition-transform ${
                        creation.likes.includes(user.id)
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-10 w-10 border-3 border-purple-500 border-t-transparent"></div>
    </div>
  );
};

export default Community;

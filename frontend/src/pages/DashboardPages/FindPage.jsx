import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useThemeStore } from "../../store/themeStore";
import { useFriendRequestStore } from "../../store/friendRequestStore";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const FindPage = () => {
  const { isDark } = useThemeStore();
  const { sendRequest, cancelRequest } = useFriendRequestStore();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const location = useLocation();


  useEffect(()=>{
    const delayDebounce = setTimeout(()=>{
      if (search.trim()){
        handleSearch();
      }else{
        setResults([]);
      }
    },200);
    return () => clearTimeout(delayDebounce);
  },[search]);

  const handleSearch = async () => {
    try {
      const res = await axios.get("http://localhost:2057/api/user/all", {
        withCredentials: true,
      });

      const filtered = res.data.filter((u) =>{
        const fullName =  `${u.firstName} ${u.lastName}`.toLowerCase();
        const email = u.email?.toLowerCase();
        const query = search.toLowerCase();

        return fullName.includes(query) || email.includes(query);
      });

      setResults(filtered);
    } catch (err) {
      console.error("Search error", err);
    }
  };

  const handleSend = async (receiverId) => {
    try {
      setLoadingId(receiverId);
      const result = await sendRequest(receiverId);
      toast.success("Friend request sent");

      setResults((prev) =>
        prev.map((u) =>
          u._id === receiverId
            ? {
                ...u,
                friendRequestStatus: "pending",
                requestDirection: "sent",
                requestId: result._id,
              }
            : u
        )
      );
    } catch {
      toast.error("Already sent or failed");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await cancelRequest(requestId);
      toast.info("Request cancelled");

      setResults((prev) =>
        prev.map((u) =>
          u.requestId === requestId
            ? {
                ...u,
                friendRequestStatus: null,
                requestDirection: null,
                requestId: null,
              }
            : u
        )
      );
    } catch {
      toast.error("Failed to cancel");
    }
  };

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-6 md:px-8 transition duration-300 ${
        isDark ? "bg-[#111111]" : "bg-[#f3f6fa]"
      }`}
    >
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <FaSearch className="text-[#288683] text-xl sm:text-2xl" />
          <h2
            className={`text-xl sm:text-2xl font-extrabold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Find Them
          </h2>
        </div>

        <div className="flex justify-center w-full mb-6">
          <div className="relative w-full max-w-md flex gap-3">
            <input
              type="text"
              placeholder="Search Ripples..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-4 pr-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#27b1ab] text-sm ${
                isDark
                  ? "bg-[#2a2a2a] border-gray-600 text-gray-200"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#288683] text-white rounded-lg hover:bg-opacity-90 text-sm"
            >
              Search
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {results.length === 0 ? (
            <p
              className={`text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No users found
            </p>
          ) : (
            results.map((u) => (
              <div
                key={u._id}
                className={`flex items-center justify-between gap-4 px-4 py-4 rounded-md ${
                  isDark
                    ? "bg-[#1f1f1f] text-white"
                    : "bg-white text-gray-800 shadow"
                }`}
              >
                <div>
                  <h4 className="font-medium text-base">
                    {u.firstName} {u.lastName}
                  </h4>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>

                <div>
                  {u.friendRequestStatus === "pending" &&
                  u.requestDirection === "sent" ? (
                    <button
                      onClick={() => handleCancel(u.requestId)}
                      className="px-4 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSend(u._id)}
                      disabled={loadingId === u._id}
                      className={`px-4 py-1.5 text-sm text-white rounded-lg transition ${
                        loadingId === u._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#288683] hover:bg-opacity-90 cursor-pointer"
                      }`}
                    >
                      Add Friend
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPage;

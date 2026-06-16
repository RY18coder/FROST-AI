import { Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (object.split(" ").length > 1) {
        return toast("Please enter only one object name");
      }

      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInput(file);
    setFileName(file ? file.name : "");
  };

  return (
    <div className="h-full overflow-y-scroll p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#417DF6] to-[#8E37EB] flex items-center justify-center">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Object Removal</h1>
            <p className="text-sm text-slate-500">Remove unwanted objects from your images</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left col - Form */}
          <form
            onSubmit={onSubmitHandler}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 text-[#4A7AFF]" />
              <h2 className="text-lg font-semibold text-slate-700">Object Configuration</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Upload Image</label>
              <input
                onChange={handleFileChange}
                type="file"
                accept="image/*"
                className="hidden"
                id="object-upload"
                required
              />
              <label
                htmlFor="object-upload"
                className="flex items-center gap-3 w-full p-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {fileName || "Click to upload an image"}
                  </p>
                  <p className="text-xs text-gray-400">JPG, PNG, and other image formats</p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Object Name to Remove</label>
              <input
                onChange={(e) => setObject(e.target.value)}
                value={object}
                className="w-full p-3 text-sm rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder="e.g., watch, spoon, car (single word only)"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Enter a single object name</p>
            </div>

            <button
              disabled={loading || !input || !object}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-6 py-3 text-sm font-medium rounded-xl cursor-pointer hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                  Processing...
                </>
              ) : (
                <>
                  <Scissors className="w-5" />
                  Remove Object
                </>
              )}
            </button>
          </form>

          {/* Right col - Result */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col min-h-[400px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <Scissors className="w-4 h-4 text-[#4A7AFF]" />
              </div>
              <h2 className="text-lg font-semibold text-slate-700">Processed Image</h2>
            </div>

            {!content ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-sm flex flex-col items-center gap-4 text-gray-400">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <Scissors className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-center">Upload an image and click "Remove Object" to get started</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={content}
                  alt="processed"
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;

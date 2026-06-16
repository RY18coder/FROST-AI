import { Image, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "Realistic style",
    "3D style",
    "Portrait style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
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

  return (
    <div className="h-full overflow-y-scroll p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00AD25] to-[#04FF50] flex items-center justify-center">
            <Image className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">AI Image Generator</h1>
            <p className="text-sm text-slate-500">Create stunning images from text descriptions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left col - Form */}
          <form
            onSubmit={onSubmitHandler}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 text-[#00AD25]" />
              <h2 className="text-lg font-semibold text-slate-700">Image Configuration</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Describe Your Image</label>
              <textarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
                rows={4}
                className="w-full p-3 text-sm rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all resize-none"
                placeholder="Describe what you want to see in the image..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Style</label>
              <div className="flex gap-2 flex-wrap">
                {imageStyle.map((item) => (
                  <span
                    onClick={() => setSelectedStyle(item)}
                    className={`text-sm px-4 py-2 rounded-xl cursor-pointer transition-all font-medium ${
                      selectedStyle === item
                        ? "bg-green-50 text-green-700 border-2 border-green-200"
                        : "text-gray-500 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => setPublish(e.target.checked)}
                  checked={publish}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition-colors"></div>
                <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
              </label>
              <p className="text-sm text-slate-600">Make this image Public</p>
            </div>

            <button
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-6 py-3 text-sm font-medium rounded-xl cursor-pointer hover:shadow-lg hover:shadow-green-500/25 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                  Generating...
                </>
              ) : (
                <>
                  <Image className="w-5" />
                  Generate Image
                </>
              )}
            </button>
          </form>

          {/* Right col - Result */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col min-h-[400px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <Image className="w-4 h-4 text-[#00AD25]" />
              </div>
              <h2 className="text-lg font-semibold text-slate-700">Generated Image</h2>
            </div>

            {!content ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-sm flex flex-col items-center gap-4 text-gray-400">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-center">Describe an image and click "Generate Image" to get started</p>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <img
                  src={content}
                  alt="generated"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;

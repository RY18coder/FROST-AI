import { Edit, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write an article about ${input} in ${selectedLength.text}`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        },
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#226BFF] to-[#65ADFF] flex items-center justify-center">
            <Edit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">AI Article Writer</h1>
            <p className="text-sm text-slate-500">Generate full-length, well-structured articles on any topic</p>
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
              <h2 className="text-lg font-semibold text-slate-700">Article Configuration</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Article Topic</label>
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
                className="w-full p-3 text-sm rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder="e.g., The future of artificial intelligence in healthcare"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Article Length</label>
              <div className="flex gap-3 flex-wrap">
                {articleLength.map((item, index) => (
                  <span
                    onClick={() => setSelectedLength(item)}
                    className={`text-sm px-4 py-2 rounded-xl cursor-pointer transition-all font-medium ${
                      selectedLength.text === item.text
                        ? "bg-blue-50 text-blue-700 border-2 border-blue-200"
                        : "text-gray-500 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    key={index}
                  >
                    {item.text}
                  </span>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-6 py-3 text-sm font-medium rounded-xl cursor-pointer hover:shadow-lg hover:shadow-blue-500/25 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                  Generating...
                </>
              ) : (
                <>
                  <Edit className="w-5" />
                  Generate Article
                </>
              )}
            </button>
          </form>

          {/* Right col - Result */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col min-h-[400px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Edit className="w-4 h-4 text-[#4A7AFF]" />
              </div>
              <h2 className="text-lg font-semibold text-slate-700">Generated Article</h2>
            </div>

            {!content ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-sm flex flex-col items-center gap-4 text-gray-400">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <Edit className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-center">Enter a topic and click "Generate Article" to get started</p>
                </div>
              </div>
            ) : (
              <div className="overflow-y-scroll text-sm text-slate-600 flex-1 pr-2">
                <div className="reset-tw">
                  <Markdown>{content}</Markdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;

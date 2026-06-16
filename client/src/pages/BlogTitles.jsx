import { useAuth } from "@clerk/clerk-react";
import { Hash, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C341F6] to-[#8E37EB] flex items-center justify-center">
            <Hash className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Blog Title Generator</h1>
            <p className="text-sm text-slate-500">Create catchy, SEO-friendly titles for your blog posts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left col - Form */}
          <form
            onSubmit={onSubmitHandler}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 text-[#8E37EB]" />
              <h2 className="text-lg font-semibold text-slate-700">Title Configuration</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Keyword</label>
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
                className="w-full p-3 text-sm rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
                placeholder="e.g., artificial intelligence, remote work, healthy eating"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Category</label>
              <div className="flex gap-2 flex-wrap">
                {blogCategories.map((item) => (
                  <span
                    onClick={() => setSelectedCategory(item)}
                    className={`text-sm px-4 py-2 rounded-xl cursor-pointer transition-all font-medium ${
                      selectedCategory === item
                        ? "bg-purple-50 text-purple-700 border-2 border-purple-200"
                        : "text-gray-500 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-6 py-3 text-sm font-medium rounded-xl cursor-pointer hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                  Generating...
                </>
              ) : (
                <>
                  <Hash className="w-5" />
                  Generate Titles
                </>
              )}
            </button>
          </form>

          {/* Right col - Result */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col min-h-[400px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <Hash className="w-4 h-4 text-[#8E37EB]" />
              </div>
              <h2 className="text-lg font-semibold text-slate-700">Generated Titles</h2>
            </div>

            {!content ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-sm flex flex-col items-center gap-4 text-gray-400">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <Hash className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-center">Enter a keyword and click "Generate Titles" to get started</p>
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

export default BlogTitles;

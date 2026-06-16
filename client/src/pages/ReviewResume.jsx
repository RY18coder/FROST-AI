import { FileText, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00DA83] to-[#009BB3] flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Resume Review</h1>
            <p className="text-sm text-slate-500">Get expert AI-powered feedback on your resume</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left col - Form */}
          <form
            onSubmit={onSubmitHandler}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 text-[#00DA83]" />
              <h2 className="text-lg font-semibold text-slate-700">Upload Resume</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Select PDF File</label>
              <div className="relative">
                <input
                  onChange={handleFileChange}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  id="resume-upload"
                  required
                />
                <label
                  htmlFor="resume-upload"
                  className="flex items-center gap-3 w-full p-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-green-300 hover:bg-green-50/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {fileName || "Click to upload your resume"}
                    </p>
                    <p className="text-xs text-gray-400">PDF only, max 5MB</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              disabled={loading || !input}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-6 py-3 text-sm font-medium rounded-xl cursor-pointer hover:shadow-lg hover:shadow-green-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <FileText className="w-5" />
                  Review Resume
                </>
              )}
            </button>
          </form>

          {/* Right col - Result */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col min-h-[400px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#00DA83]" />
              </div>
              <h2 className="text-lg font-semibold text-slate-700">Analysis Results</h2>
            </div>

            {!content ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-sm flex flex-col items-center gap-4 text-gray-400">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-center">Upload a resume and click "Review Resume" to get started</p>
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

export default ReviewResume;

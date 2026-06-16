import React, { useState } from "react";
import Markdown from "react-markdown";

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-5 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:shadow-md transition-all duration-200"
    >
      <div className="flex justify-between items-center gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-medium text-slate-700 truncate">{item.prompt}</h2>
          <p className="text-xs text-gray-400 mt-1">
            {item.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} ·{" "}
            {new Date(item.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <span className="shrink-0 text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-medium capitalize">
          {item.type.replace("-", " ")}
        </span>
      </div>
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {item.type === "image" ? (
            <div>
              <img
                src={item.content}
                alt="image"
                className="mt-2 w-full max-w-md rounded-xl"
              />
            </div>
          ) : (
            <div className="h-full overflow-y-scroll text-sm text-slate-700 max-h-96">
              <div className="reset-tw">
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;

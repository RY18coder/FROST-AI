import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", NavIcon: House },
  { to: "/ai/write-article", label: "Write Article", NavIcon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", NavIcon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", NavIcon: Image },
  { to: "/ai/remove-background", label: "Remove Background", NavIcon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", NavIcon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", NavIcon: FileText },
  { to: "/ai/community", label: "Community", NavIcon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-64 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 z-20 ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"} transition-transform duration-300 ease-in-out`}
    >
      <div className="my-6 w-full">
        <div className="px-5 mb-4">
          <img
            src={user.imageUrl}
            alt="User avatar"
            className="w-14 h-14 rounded-full mx-auto ring-2 ring-gray-100"
          />
          <h1 className="mt-2 text-center text-sm font-semibold text-slate-700 truncate">
            {user.fullName}
          </h1>
        </div>

        <div className="px-3 text-sm text-gray-600 font-medium space-y-0.5">
          {navItems.map((item) => {
            const { to, label, NavIcon } = item;
            return (
              <NavLink
                key={to}
                to={to}
                end={to === "/ai"}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 flex items-center gap-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white shadow-md shadow-purple-500/20"
                      : "text-slate-600 hover:bg-gray-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <NavIcon
                      className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`}
                    />
                    <span className="font-medium">{label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="w-full border-t border-gray-100 p-4 px-5 flex items-center justify-between">
        <div
          onClick={openUserProfile}
          className="flex gap-2.5 items-center cursor-pointer hover:bg-gray-50 rounded-xl p-1.5 -m-1.5 transition-colors"
        >
          <img src={user.imageUrl} className="w-9 h-9 rounded-full" alt="" />
          <div className="min-w-0">
            <h1 className="text-sm font-medium text-slate-700 truncate">{user.fullName}</h1>
            <p className="text-xs text-gray-400">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>{" "}
              Plan
            </p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;

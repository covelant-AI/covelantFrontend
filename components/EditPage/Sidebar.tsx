'use client';
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import hamburger and close icons

type SidebarProps = {
  activePage: string;
  setActivePage: (page: string) => void;
};

const pages = [
  'Profile Settings',
  'Security Settings',
  'Account Preferences',
  'Role & Access',
  'Subscription & Billing',
];

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for toggling the sidebar

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle the sidebar visibility
  };

  return (
    <aside className="relative w-48 bg-white pt-10 flex flex-col space-y-3 text-md font-semibold text-black border-r-1 border-gray-200 max-lg:border-r-0 max-md:pt-2">
      {/* Hamburger Menu for small screens */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-4 text-2xl flex justify-center items-center z-20"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />} {/* Toggle between hamburger and close icons */}
      </button>

      {/* Sidebar items (Dropdown for small screens) */}
      <div
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } fixed top-0 left-0 right-0 bottom-0 bg-white z-30 md:hidden flex justify-center items-center`}
        onClick={() => setSidebarOpen(false)} // Close the sidebar when clicked outside
      >
        <div className="space-y-3 text-md font-semibold text-black flex flex-col w-full max-w-xs bg-white p-4 shadow-lg">
          {pages.map((page) => (
            <button
              key={page}
              className={`text-left px-6 py-2 transition-colors duration-200 ${
                activePage === page
                  ? 'bg-[#D9F0EF] text-black font-bold w-full rounded-lg'
                  : 'hover:bg-gray-200 w-full rounded-lg'
              }`}
              onClick={() => {
                setActivePage(page);
                setSidebarOpen(false); // Close the menu when a page is clicked
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Regular sidebar for larger screens */}
      <div className="hidden md:block">
        {pages.map((page) => (
          <button
            key={page}
            className={`text-left px-6 py-2 transition-colors duration-200 pb-4 ${
              activePage === page
                ? 'bg-[#D9F0EF] w-full text-black font-bold'
                : 'hover:bg-gray-200 w-full'
            }`}
            onClick={() => setActivePage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </aside>
  );
}

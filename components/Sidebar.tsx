import React from 'react'

type SidebarProps = {
  activePage: string
  setActivePage: (page: string) => void
}

const pages = [
  'Profile Settings',
  'Security Settings',
  'Account Preferences',
  'Role & Access',
  'Subscription & Billing',
]

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <aside className="w-48 bg-white pt-10 flex rounded-xl flex-col space-y-3 text-md font-semibold text-black border-r-1 border-gray-200">
      {pages.map((page) => (
        <button
          key={page}
          className={`text-left px-6 py-2 transition-colors duration-200 ${
            activePage === page ? 'bg-[#D9F0EF] text-black font-bold' : 'hover:bg-gray-200'
          }`}
          onClick={() => setActivePage(page)}
        >
          {page}
        </button>
      ))}
    </aside>
  )
}

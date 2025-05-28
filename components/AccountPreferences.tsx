export default function AccountPreferences() {
  return (
    <div className="max-w-sm mx-auto p-6 bg-white">
      {/* Email Section */}
      <label className="block text-gray-400 text-sm mb-1" htmlFor="email">
        Language
      </label>
      <input
        type="email"
        id="email"
        value="English"
        disabled
        className="w-full bg-gray-100 text-gray-400 cursor-not-allowed rounded-md px-4 py-2 mb-2"
      />

      {/* timeZone Section */}
      <label className="block text-gray-400 text-sm mb-1 mt-4" htmlFor="password">
        Timezone
      </label>
      <input
        type="text"
        id="timeZone"
        value="ECT"
        disabled
        className="w-full bg-gray-100 text-gray-400 cursor-not-allowed rounded-md px-4 py-2 mb-2"
      />

      <label className="block text-gray-600 text-sm mb-1 mt-4">Notification Preferences</label>
      <select
          name="Notification"
          value="notification"
          disabled
          className="w-full bg-gray-100 text-gray-400 cursor-not-allowed rounded-md px-4 py-2 mb-2">
          <option>E-mail</option>
          <option>Phone</option>
      </select>
      <p className="text-center text-gray-300">personal Preferences feature coming soon</p>
    </div>
  )
}
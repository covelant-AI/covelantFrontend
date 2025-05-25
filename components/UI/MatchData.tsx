export default function MatchData() {

    return(
        <div className="bg-white rounded-xl items-center shadow-sm p-4 w-full">
          <h2 className="text-xl font-bold mb-4 text-black">Match Data</h2>

          {/* Player Selection */}
          <div className="flex justify-between gap-6 mb-4 px-6">
            <div className="flex-1 border border-gray-200 rounded-xl flex flex-col items-center justify-center shadow-md bg-gray-100 h-45 hover:border-cyan-400 cursor-pointer">
              <button className="flex items-center justify-center w-12 h-12 bg-white border border-[#E7E7E7] text-black rounded-xl
                             cursor-pointer hover:bg-[#42B6B1] hover:text-white transition-colors duration-300">
                <svg 
                className="w-5 h-5 stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                </svg>
            </button>
              <span className="text-sm text-black">Your Athlete</span>
            </div>
            <div className="flex items-center font-bold text-gray-400">VS</div>
            <div className="flex-1 border border-gray-200 rounded-xl flex flex-col items-center justify-center h-45 shadow-md bg-gray-100 hover:border-cyan-400 cursor-pointer">
              <button className="flex items-center justify-center w-12 h-12 bg-white border border-[#E7E7E7] text-black rounded-xl
                             cursor-pointer hover:bg-[#42B6B1] hover:text-white transition-colors duration-300">
                <svg 
                className="w-5 h-5 stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                </svg>
              </button>
              <span className="text-sm text-black">Opponent</span>
            </div>
          </div>

          <hr className="my-4" />

          {/* Dropdowns */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select className="border border-gray-200 shadow-md rounded-md p-2 text-sm text-gray-700">
              <option value="">Match Type</option>
              <option value="tournament">Tournament</option>
              <option value="friendly">Friendly</option>
              <option value="training">Training</option>
              <option value="league">League</option>
            </select>
            <select className="border border-gray-200 shadow-md rounded-md p-2 text-sm text-gray-700">
              <option value="">Competition</option>
              <option value="local">Local</option>
              <option value="national">National</option>
              <option value="international">International</option>
            </select>
          </div>

          {/* Date Picker */}
          <input
            type="date"
            className="w-full border border-gray-200 shadow-md rounded-md p-2 mb-6 text-sm text-gray-700"
          />
        </div>
    )
}
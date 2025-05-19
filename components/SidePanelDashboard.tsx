import RadarGraph from './UI/RadarGraph'

export default function SidePanelDashboard() {
    return (
        <div className="col-span-3 flex justify-center">
                <div className="bg-white rounded-2xl py-6 px-2 flex flex-col items-center gap-4 w-[60%] lg:w-[120%] xl:w-[90%]">
           
                {/* Profile + status icons */}
                <div className='bg-gray-100 w-full rounded-2xl p-1'>
                <div className="flex flex-col w-full gap-4 bg-[#FFFFFF] p-4 rounded-2xl">
                    <span className='flex flex-row items-center gap-4'>
                        <img
                          src="/testImages/test.jpg"
                          alt="Alexis Lebrun"
                          className="w-19 h-19 rounded-full object-cover"
                        />
                        <h3 className="text-xl font-semibold text-gray-800">Alexis <br/> <span className='font-bold'>Lebrun</span></h3>
                    </span>
                <div className="flex items-center gap-2 justify-between pt-8 text-xl">
                  <span className="flex items-center justify-center text-white bg-[#C6C6C6] w-10 lg:w-9 h-9 rounded-full">?</span>
                  <span className="flex items-center justify-center text-white bg-[#42B6B1] w-10 lg:w-9 h-9 rounded-full">✓</span>
                  <span className="flex items-center justify-center text-white bg-[#42B6B1] w-10 lg:w-9 h-9 rounded-full">✓</span>
                  <span className="flex items-center justify-center text-white bg-[#42B6B1] w-10 lg:w-9 h-9 rounded-full">✓</span>
                  <span className="flex items-center justify-center text-white bg-[#FF4545] w-10 lg:w-9 h-9 rounded-full">✕</span>
                </div>
        
                </div>
        
                {/* Advanced - tier section */}
                <span className="flex text-sm text-white items-center justify-between px-2">
                    <button className="text-black px-4 py-2 text-xl">Advanced</button>
                    <button className="text-black px-4 py-2 text-xl">Tier</button>
                </span>
                </div>
                {/* Radar chart placeholder */}
                <div className="w-full rounded-lg bg-[#FFFFFF]">
                  <div className="w-full h-60 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 p-4">
                    <RadarGraph />
                  </div>
                </div>
                </div>
              </div>
    )
}
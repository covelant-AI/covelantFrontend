import { useAuth } from '@/app/context/AuthContext';

type Match = {
  id: number
  title: string
  imageUrl: string
}

const matches: Match[] = [
  { id: 1, title: 'Alexis Lebrun vs Hugo Calderano', imageUrl: '/testImages/match.png' },
  { id: 2, title: 'Alexis Lebrun vs LIANG Jinkun',   imageUrl: '/testImages/match.png' },
  { id: 3, title: 'Alexis Lebrun vs Fan Zhendong',  imageUrl: '/testImages/match.png' },
  { id: 4, title: 'Alexis Lebrun vs Liam Pitchford',imageUrl: '/testImages/match.png' },
  { id: 5, title: 'Alexis Lebrun vs Xiang Peng',    imageUrl: '/testImages/match.png' },
]

export default function VideoDashboard() {
    const { type } = useAuth();


    return (
        <div className="col-span-1 lg:col-span-9 rounded-2xl shadow p-1 flex flex-col gap-2 bg-[#F8F8F8] my-5 justify-center">

        {/* Matches grid */}
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2 bg-[#FFFFFF]  rounded-2xl">
          {matches.map(m => (
            <div key={m.id} className="relative rounded-lg overflow-hidden h-50 bg-[#F8F8F8] border-2 border-[#F8F8F8] 
                hover:scale-[1.05] transition duration-300">
              <img
                src={m.imageUrl}
                alt={m.title}
                className="w-full h-full object-cover"
              />

              {/* Black gradient fade at bottom */}
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />

              <div className="absolute bottom-2 left-2 text-gray-300 text-xs font-semibold px-2 py-1 rounded">
                {m.title}
              </div>
            </div>
          ))}
        </div>

        {/* Filters / controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4">
          {/* Player selector */}
          {type == "coach" ? 
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-lg">
            <img
              src="/testImages/test.jpg"
              alt="Alexis"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-gray-700">Alexis Lebrun</span>
            <span className="text-gray-500">▼</span>
          </button> : <></>}

          <div className='flex items-center gap-6'>
          {/* Win rate */}
          <div className="flex items-baseline gap-2 bg-white border border-gray-300 rounded-full px-4 py-1">
            <span className="text-lg text-gray-600">Win Rate</span>
            <span className="text-lg font-bold text-green-600">71%</span>
          </div>

          {/* Sort */}
          <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-lg text-gray-700">
            Filter ↕
          </button>

          {/* Time filter */}
          <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-lg text-gray-700">
            <span>Last month</span>
            <span className="text-gray-500">▼</span>
          </button>
          </div>
        </div>
      </div>
    )
}
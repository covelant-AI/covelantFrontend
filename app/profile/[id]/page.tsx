import { PrismaClient } from '@/generated/prisma';
import NavBar from '@/components/nav/Navbar';
import Image from 'next/image';
import SemiCircleGauge from '@/components/UI/SemiCircleGauge';
import CircleChart from '@/components/UI/CircleChart'

interface ProfilePageProps {
  params: { id: string };
}

const prisma = new PrismaClient();

export default async function PlayerProfilePage({ params }: ProfilePageProps) {
  const { id } = params;
  const playerId = parseInt(id, 10);
  if (isNaN(playerId)) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gray-100 pt-20">
          <p className="text-center pt-8 text-red-600">Invalid player ID.</p>
        </div>
      </>
    );
  }

  let player;
  try {
    player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        stats: true,          // keep fetching PlayerStat rows (subject/value)
        overallStats: true,   // fetch OverallStats relation
      },
    });
  } catch (err) {
    console.error('Database error fetching player:', err);
  }

  if (!player) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gray-100 pt-20">
          <p className="text-center pt-8 text-red-600">Player not found.</p>
        </div>
      </>
    );
  }

  // Render page with new OverallStats used in place of old aggregate PlayerStat row
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 pt-40">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-4">
            <div className="flex flex-wrap items-center gap-x-6 mb-6 justify-center">
                <div className='flex flex-row justify-center gap-x-6'>
                  <div className="w-24 h-24 relative flex-shrink-0 justify-end mt-4">
                    <Image
                      src={player.avatar || '/images/default-avatar.png'}
                      alt={`${player.firstName} ${player.lastName}`}
                      fill
                      className="rounded-full object-cover"
                      />
                  </div>
                  <div className="flex-1 text-center">
                    <h1 className="font-sans italic font-bold text-5xl leading-tight">
                      <span className="text-[#42B6B1]">{player.firstName}</span>
                      <br />
                      <span className="text-outline-teal text-6xl">{player.lastName}</span>
                    </h1>
                </div>
            </div>
            </div>


            
            {/* Stats row: Age, Height, W/L */}
            <div className="flex flex-wrap md:grid md:grid-cols-3 md:items-center md:justify-items-center md:gap-2 px-4 md:px-20">
              <div className="w-24 h-24 relative justify-center mb-6 md:mb-0">
                <h3 className="font-sans italic font-normal text-[#42B6B1] text-md text-center">AGE</h3>
                <h3 className="font-sans font-bold text-black text-2xl text-center">{player.age || 'NA'}</h3>
              </div>
              <div className="w-24 h-24 relative justify-self-center mb-6 md:mb-0">
                <h3 className="font-sans italic font-normal text-[#42B6B1] text-md text-center">HEIGHT</h3>
                <h3 className="font-sans font-bold text-black text-2xl text-center">{player.height || 'NA'}</h3>
              </div>
              <div className="w-24 h-24 relative justify-self-center mb-6 md:mb-0">
                <h3 className="font-sans italic font-normal text-[#42B6B1] text-md text-center">W/L</h3>
                <h3 className="font-sans font-bold text-black text-2xl text-center">
                  {player.winRate != null ? `${(player.winRate * 100).toFixed(0)}%` : 'NA'}
                </h3>
              </div>
            </div>
            
            {/* THE GREAT SEPERATOR ALL HAIL THE MIGHTY LINE!! */}
            <div className="flex items-center text-gray-400 font-semibold py-6 px-8">
              <div className="flex-grow border-t border-gray-300"></div>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            {/* OverallStats shown separately in a full-width card */}
            {player.overallStats && (
              <div className="bg-white p-4 rounded-lg col-span-2">
                <p className="font-bold text-xl mb-2 text-black">Match Performance Stats</p>
                <div className="flex flex-row md:flex-nowrap flex-wrap space-x-6 md:space-x-6 space-x-0 justify-around p-8">
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-black font-medium text-md ml-3">Total Matches W/L</h3>
                    <CircleChart wins={player.overallStats.wins} losses={player.overallStats.losses} percentage={true} />
                  </div>
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-black font-medium text-md ml-3">Total Sets W/L</h3>
                    <CircleChart wins={player.overallStats.setsWon} losses={player.overallStats.setsLost} percentage={false} />
                  </div>
                </div>
            
                <div className="flex flex-row md:flex-nowrap flex-wrap space-x-6 md:space-x-6 space-x-0 justify-around p-8">
                  <div className="mb-6 md:mb-0 text-center">
                    <h3 className="text-black font-medium text-md mb-2">Total Matches Played</h3>
                    <div className="text-center p-6">
                      <h1 className="font-sans italic font-bold text-5xl leading-tight">
                        <span className="text-outline-black text-6xl">{player.overallStats.totalMatches}</span>
                      </h1>
                    </div>
                  </div>
                  <div className="mb-6 md:mb-0 text-center">
                    <h3 className="text-black font-medium text-md mb-2">Total Sets Played</h3>
                    <div className="text-center pt-6">
                      <h1 className="font-sans italic font-bold text-5xl leading-tight flex items-center justify-center">
                        <span className="text-outline-black text-6xl">{player.overallStats.avgMatchDuration}</span>
                        <span className="text-2xl text-black font-normal pl-2">Min</span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )}

            


          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              {player.stats.map((stat) => (
                <div key={stat.id} className="bg-gray-50 p-3 rounded-lg border">
                  <p className="font-medium text-black">{stat.subject}</p>
                  <p className="text-gray-800">{stat.value}</p>
                </div>
              ))}

            </div>
            <SemiCircleGauge primaryPct={82} secondaryPct={63} size={240} strokeWidth={18} />
          </div>
        </div>
      </div>
    </>
  );
}


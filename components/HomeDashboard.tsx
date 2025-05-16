export default function HomeDashboard() {
    return (
        <div className="relative overflow-hidden flex justify-between items-center size-duto px-20 xl:px-40 pt-20 pb-8 bg-[#F9F9F9]">
            {/* left side */}
            <div className="flex flex-col items-center justify-center w-full max-w-4xl p-6 bg-white rounded-xl shadow-md px-4">
                <h1 className="text-2xl font-bold text-gray-800">Welcome to the Home Dashboard</h1>
                <p className="mt-4 text-gray-600">This is where you can manage your account and settings.</p>
            </div>

            {/* right side */}
            <div className="flex flex-col col-2 items-center justify-between w-full max-w-4xl mt-6 bg-white ">
                <div className="mt-4">
                    <ul className="list-disc list-inside">
                        <li className="text-gray-600">Activity 1</li>
                        <li className="text-gray-600">Activity 2</li>
                        <li className="text-gray-600">Activity 3</li>
                    </ul>
                </div>
                <div className="mt-4">
                    <ul className="list-disc list-inside">
                        <li className="text-gray-600">Activity 1</li>
                        <li className="text-gray-600">Activity 2</li>
                        <li className="text-gray-600">Activity 3</li>
                    </ul>
                </div>
            <div/>     
            </div>
        </div>
    )
}
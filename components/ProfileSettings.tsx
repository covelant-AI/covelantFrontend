import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { UserData } from '@/util/interfaces'

export default function ProfileSettings() {
  const { user, type } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Form state: controlled inputs
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dominantHand: 'Right Handed',
    age: '',
    height: '',
    email: '',
  })

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return

      try {
        const response = await fetch(`/api/getUser?email=${encodeURIComponent(user.email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        const result = await response.json()
        if (result.error) throw new Error('Failed to fetch user data')

        setUserData(result.data)

        // Initialize form state from fetched user data
        setForm({
          firstName: result.data.firstName || '',
          lastName: result.data.lastName || '',
          dominantHand: result.data.dominantHand || 'Right Handed',
          age: result.data.age || '',
          height: result.data.height || '',
          email: result.data.email || '',
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user?.email])

  // Handle input changes to update form state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

    const handleSave = async () => {
      try {
        const response = await fetch('/api/updateUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form, type }),  
        })
    
        if (!response.ok) {
          throw new Error('Failed to update user data')
        }
    
        const data = await response.json()
      } catch (error) {
        console.error('Error updating user data:', error)
      }
    }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="px-20 py-4 max-w-2xl mx-auto flex flex-col gap-4 text-sm text-gray-700">
      {/* Profile picture and buttons */}
      <div className="col-span-1 flex flex-row justify-center items-center space-x-4">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
          <img
            src={userData?.avatar || './images/default-avatar.png'}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex space-x-4">
          <button className="bg-[#42B6B1] text-white px-4 py-1 rounded-md hover:bg-teal-600 transition cursor-pointer">
            Change Picture
          </button>
          <button className="border border-gray-100 bg-[#F9F9F9] text-red-500 font-semibold px-4 py-1 rounded-md cursor-pointer hover:bg-red-50 transition">
            Delete Picture
          </button>
        </div>
      </div>

      {/* Form inputs */}
      <div className="flex flex-col gap-4 justify-center gap-y-6">
        <div className="grid grid-cols-2 gap-4">
          <span>
            <div className="mb-1">
              <label className="text-right pr-2 text-gray-400">Name</label>
            </div>
            <div>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="border border-gray-100 w-full bg-[#F9F9F9] rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </span>
          <span>
            <div className="mb-1">
              <label className="text-right pr-2 text-gray-400">Surname</label>
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="border border-gray-100 w-full bg-[#F9F9F9] rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <span>
            <div className="mb-1">
              <label className="text-right pr-2 text-gray-400">Age</label>
            </div>
            <div>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="border border-gray-100 w-full bg-[#F9F9F9] rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </span>
          <span>
            <div className="mb-1">
              <label className="text-right pr-2 text-gray-400">Email (cannot change)</label>
            </div>
            <div>
              <input
                  type="text"
                  name="email"
                  value={form.email}
                  disabled
                  className="border text-gray-300 border-gray-100 w-full bg-[#F9F9F9] rounded-md px-3 py-1 cursor-not-allowed"
                />
            </div>
          </span>
        </div>

        {type==="player"? <div className="grid grid-cols-2 gap-4">
          <span>
            <div className="mb-1">
              <label className="text-right pr-2 text-gray-400">Dominant Hand</label>
            </div>
            <div>
              <select
                name="dominantHand"
                value={form.dominantHand}
                onChange={handleChange}
                className="border border-gray-100 w-full bg-[#F9F9F9] rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option>Right Handed</option>
                <option>Left Handed</option>
              </select>
            </div>
          </span>
          <span>
            <div className="mb-1">
              <label className="text-right pr-2 text-gray-400">Height</label>
            </div>
            <div>
              <input
                type="number"
                name="height"
                value={form.height}
                onChange={handleChange}
                className="border border-gray-100 w-full bg-[#F9F9F9] rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </span>
        </div>
        :<></>}
      </div>

      {/* Save button */}
      <div className="col-span-2 flex justify-center mt-6">
        <button
          onClick={handleSave}
          className="bg-[#42B6B1] text-white rounded-md px-20 py-2 font-semibold hover:bg-teal-600 transition cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { profile as ProfileType } from '@/util/interfaces'
import { storage, ref, uploadBytesResumable, getDownloadURL } from '@/app/firebase/config';


export default function ProfileSettings() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileType | null>(null)
  

  // Extend form to include avatar
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dominantHand: 'Right Handed',
    age: 20,
    height: 180,
    email: '',
    avatar: '/images/default-avatar.png',
  })
  const [initialForm, setInitialForm] = useState(form);

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Load session profile ONCE on mount
  useEffect(() => {
    const keys: (keyof Storage)[] = ['userEmail', 'firstName', 'lastName', 'avatar', 'type'];
    const values: (string | null)[] = keys.map((key) => sessionStorage.getItem(String(key)));

    if (values.every((value): value is string => value !== null)) {
      const [email, firstName, lastName, avatar, type] = values;
      setProfile({ email, firstName, lastName, avatar, type });
    } else {
      setLoading(false)
    }
  }, [])

  // 2. Once we have a profile.email, fetch the rest of the user data
  useEffect(() => {
    if (!profile?.email) return

    setLoading(true)
    fetch(`/api/getUser?email=${encodeURIComponent(profile.email)}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error) throw new Error(result.error);
        const loadedForm = {
          firstName: result.data.firstName || '',
          lastName: result.data.lastName || '',
          dominantHand: result.data.dominantHand || 'Right Handed',
          age: Number(result.data.age) || 0,
          height: Number(result.data.height) || 0,
          email: result.data.email || '',
          avatar: result.data.avatar || '/images/default-avatar.png',
        };
        setForm(loadedForm);
        setInitialForm(loadedForm);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [profile?.email])

    const isFormChanged = () => {
    if (!initialForm) return false;
    return (
      form.firstName !== initialForm.firstName ||
      form.lastName !== initialForm.lastName ||
      form.dominantHand !== initialForm.dominantHand ||
      form.age !== initialForm.age ||
      form.height !== initialForm.height ||
      form.avatar !== initialForm.avatar
    );
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Build payload including type right before sending
  const handleSave = async () => {
    if (!profile?.type) {
      console.error('Missing profile.type, cannot save')
      return
    }

    const payload = { ...form, type: profile.type }
    try {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Failed to update user data')
      // hard reload on success
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  // Delete picture handler
  const handleDeletePicture = () => {
    // update form under the hood, then call handleSave
    setForm((prev) => ({ ...prev, avatar: '/images/default-avatar.png' }))
    // we can call handleSave immediately with the same payload pattern:
    if (profile?.type) {
      const payload = { ...form, avatar: '/images/default-avatar.png', type: profile.type }
      fetch('/api/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) throw new Error()
          window.location.reload()
        })
        .catch(console.error)
    }
  }

  // Change picture handler (opens file picker)
  const handleChangePicture = () => {
    fileInputRef.current?.click()
  }

  // When file selected
  const handleFileSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.type) return;

    // Optional: Preview local avatar immediately
    const localUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, avatar: localUrl }));

    try {
      // Upload avatar to Firebase Storage
      const avatarRef = ref(storage, `avatars/${profile.email}_${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(avatarRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optionally, you can add upload progress UI here
        },
        (error) => {
          console.error('Avatar upload failed:', error);
          alert('Failed to upload avatar image');
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          // Update form with the Firebase avatar URL
          setForm((prev) => ({ ...prev, avatar: downloadURL }));
        }
      );
    } catch (error) {
      console.error(error);
    }
  };


  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="px-20 py-4 max-w-2xl mx-auto flex flex-col gap-4 text-sm text-gray-700">
      {/* hidden file input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelected}
      />

      {/* Profile picture and buttons */}
      <div className="col-span-1 flex flex-row justify-center items-center space-x-4">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
          <img
            src={form.avatar || '/images/default-avatar.png'}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleChangePicture}
            className="bg-[#42B6B1] text-white px-4 py-1 rounded-md hover:bg-teal-600 transition"
          >
            Change Picture
          </button>
          <button
            onClick={handleDeletePicture}
            className="border border-gray-100 bg-[#F9F9F9] text-red-500 font-semibold px-4 py-1 rounded-md hover:bg-red-50 transition"
          >
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

        {profile?.type==="player"? <div className="grid grid-cols-2 gap-4">
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
          disabled={!isFormChanged()}
          className={`rounded-md px-20 py-2 font-semibold transition
            ${isFormChanged()
              ? 'bg-[#42B6B1] text-white hover:bg-teal-600  cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
          Save
        </button>

      </div>
    </div>
  )
}

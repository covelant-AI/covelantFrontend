import React, { useEffect, useRef, useState } from 'react'
import { storage, ref, uploadBytesResumable, getDownloadURL } from '@/app/firebase/config';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-toastify';
import {Msg} from '@/components/UI/ToastTypes';
import * as Sentry from "@sentry/nextjs";

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false);
  const { profile } = useAuth();
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


  // 2. Once we have a profile.email, fetch the rest of the user data
  useEffect(() => {
    if (!profile?.email) return

    setLoading(true)
    fetch(`/api/getUser?email=${encodeURIComponent(profile.email)}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error){
          toast.error(Msg, {
            data: {
              title: 'Error fetching your profile',
              message: 'Seams like we cannot fetch your profile data right now. Try checking your internet or try again later.',
            },
            position: 'bottom-right',
          })
          Sentry.captureException(result.error);
          return;
        } 
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
      .catch((err) => {
        toast.error(Msg, {
          data: {
            title: 'Error fetching your profile',
            message: 'Seams like we cannot fetch your profile data right now. Try checking your internet or try again later.',
          },
          position: 'bottom-right',
        })
        Sentry.captureException(err)
      })
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
    if (uploading) return;
    if (!profile?.type) {
      return
    }

    const payload = { ...form, type: profile.type }
    try {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        toast.error(Msg, {
          data: {
            title: 'Failed to update profile',
            message: 'Seams like we cannot update your profile data right now. Try checking your internet or try again later.',
          },
          position: 'bottom-right',
        })
      }
      // hard reload on success
      toast.success('Profile updated successfully!', {
        position: 'bottom-right',
      })
      window.location.reload()
    } catch (error) {
      toast.error(Msg, {
        data: {
          title: 'Server Error',
          message: 'There seems to be an error on our side, the error has been logged and we will fix it immidiatly. Please try again later.',
        },
        position: 'bottom-right',
      })
      Sentry.captureException(error)
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
          if (!res.ok){
            toast.error(Msg, {
              data: {
                title: 'Failed to delete picture',
                message: 'Seams like we cannot delete your profile picture right now. Try checking your internet or try again later.',
              },
              position: 'bottom-right',
            })
          }
          toast.success('Profile picture deleted successfully!', {
            position: 'bottom-right',
          })
          window.location.reload()
        })
        .catch( (error) => {
          toast.error(Msg, {
            data: {
              title: 'Server Error',
              message: 'There seems to be an error on our side, the error has been logged and we will fix it immidiatly. Please try again later.',
            },
            position: 'bottom-right',
          })
          Sentry.captureException(error)
        })
    }
  }

const handleChangePicture = () => {
  fileInputRef.current?.click();
};

// When file selected
  const handleFileSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.type) return;

    // preview immediately
    const localUrl = URL.createObjectURL(file);
    setForm(prev => ({ ...prev, avatar: localUrl }));

    try {
      if (!file.type.startsWith('image/')) {
        toast.error(Msg, {
          data: {
            title: 'Selected file is not an image',
            message: 'The image you selected is not a valid image file. Please select a valid image file.',
          },
          position: 'bottom-right',
        })
        return;
      }

      setUploading(true);  // <-- start upload lock

      const avatarRef = ref(storage, `avatars/${profile.email}_${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(avatarRef, file);

      uploadTask.on(
        'state_changed',
        () => {/* progress… */},
        (error) => {
          toast.error(Msg, {
            data: {
              title: 'Upload failed',
              message: 'There was an error uploading your image. Please try again later.',
            },
            position: 'bottom-right',
          })
          Sentry.captureException(error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setForm(prev => ({ ...prev, avatar: downloadURL }));
          URL.revokeObjectURL(localUrl);
          toast.success('Image is ready for upload, Click save!',
            {
              position: 'bottom-right',
            }
          );
          setUploading(false);  // <-- unlock when real URL is set
        }
      );
    } catch (err) {
      toast.error(Msg, {
        data: {
          title: 'Upload Error',
          message: 'There was an error uploading your image. Please try again later.',
        },
        position: 'bottom-right',
      })
      Sentry.captureException(err);
      setUploading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...<br/>If it takes too long please refresh the page</p>

  return (
    <div className="px-20 py-4 max-w-2xl mx-auto flex flex-col gap-4 text-sm text-gray-700 max-md:px-4 max-md:py-6">
      {/* hidden file input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelected}
      />

      {/* Profile picture and buttons */}
      <div className="col-span-1 flex flex-row justify-center items-center space-x-4 max-md:flex-col max-md:items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg max-md:mb-4 max-md:mr-0">
         <Image
            src={form.avatar || '/images/default-avatar.png'}
            alt="Profile"
            width={500} // You can adjust the width as per your layout or desired size
            height={500} // Adjust the height to match the aspect ratio
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
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
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

        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
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

        {profile?.type==="player"? <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
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
          disabled={!isFormChanged() || uploading}  // disable during upload
          className={`rounded-md px-20 py-2 font-semibold transition
            ${isFormChanged() && !uploading
              ? 'bg-[#42B6B1] text-white hover:bg-teal-600 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {uploading ? 'Uploading…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

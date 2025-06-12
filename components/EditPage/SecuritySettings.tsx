import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app';

export default function SecuritySettings() {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const { user } = useAuth()

  async function handdleOnSubmit(currentPassword: string, newPassword: string, repeatPassword: string) {
    if (!user || !user.email) {
      alert('User not logged in or email unavailable')
      return
    }
    if (newPassword !== repeatPassword) {
      alert('New passwords do not match')
      return
    }

    try {
      // Create credential with current email and password
      const credential = EmailAuthProvider.credential(user.email, currentPassword)

      // Reauthenticate user
      await reauthenticateWithCredential(user, credential)

      // Update password
      await updatePassword(user, newPassword)

      alert('Password updated successfully!')

      // Reset form and hide password change inputs
      setIsChangingPassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setRepeatPassword('')
    } catch (error) {
      if (error instanceof FirebaseError) { 
        if (error.code === 'auth/wrong-password') {
          alert('Your current password is not correct');
        } else {
          alert('Error updating password: ' + error.message);
        }
      } else {
        // Handle unexpected errors
        alert('An unexpected error occurred: ' + (error as Error).message);
      }
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-white font-sans">
      {/* Email Section */}
      {!isChangingPassword && (
        <>
          <label className="block text-gray-400 text-sm mb-1" htmlFor="email">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            value={user?.email || ''}
            disabled
            className="w-full bg-gray-100 text-gray-400 cursor-not-allowed rounded-md px-4 py-2 mb-2 border border-gray-200"
          />
          <p className="text-xs text-gray-400 mb-6">
            For security reasons the email address cannot be modified as it is linked to this account
          </p>
        </>
      )}

      {/* Password Section or Change Password Inputs */}
      {!isChangingPassword ? (
        <>
          <label className="block text-gray-600 text-sm mb-1" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value="****************"
            readOnly
            className="w-full bg-gray-100 text-black rounded-md px-4 py-2 mb-1 border border-gray-200"
          />
          <div
            className="text-xs text-[#42B6B1] mb-10 cursor-pointer hover:underline"
            onClick={() => setIsChangingPassword(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setIsChangingPassword(true)}
          >
            Change your password?
          </div>
        </>
      ) : (
        <form
          className="flex flex-col gap-2 mb-10"
          onSubmit={(e) => {
            e.preventDefault()
            handdleOnSubmit(currentPassword, newPassword, repeatPassword)
          }}
        >
          <label className="block text-gray-600 text-sm" htmlFor="password">
            Current Password
          </label>
          <input
            type="password"
            placeholder="ex. ABCD1234"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-gray-100 text-black rounded-md px-4 py-2 border border-gray-200"
            required
          />
          <label className="block text-gray-600 text-sm mt-4" htmlFor="password">
            New Password
          </label>
          <input
            type="password"
            placeholder="Ex. A2h#H3j!k#"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-gray-100 text-black rounded-md px-4 py-2 border border-gray-200"
            required
          />
          <label className="block text-gray-600 text-sm mt-4" htmlFor="password">
            Repeat New Password
          </label>
          <input
            type="password"
            placeholder="Ex. A2h#H3j!k#"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-full bg-gray-100 text-black rounded-md px-4 py-2 border border-gray-200"
            required
          />
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-[#42B6B1] hover:bg-teal-600 transition-colors text-white font-normal py-3 rounded-xl cursor-pointer w-full mr-2"
            >
              Save Password
            </button>
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 font-normal py-3 rounded-xl cursor-pointer w-full"
              onClick={() => setIsChangingPassword(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}


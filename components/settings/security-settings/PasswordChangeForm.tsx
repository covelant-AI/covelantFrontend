import React from "react";

type Props = {
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
  onChangeCurrent: (v: string) => void;
  onChangeNew: (v: string) => void;
  onChangeRepeat: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function PasswordChangeForm({
  currentPassword,
  newPassword,
  repeatPassword,
  onChangeCurrent,
  onChangeNew,
  onChangeRepeat,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <form
      className="flex flex-col gap-2 mb-10"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label className="block text-gray-600 text-sm" htmlFor="current-password">
        Current Password
      </label>
      <input
        id="current-password"
        type="password"
        placeholder="ex. ABCD1234"
        value={currentPassword}
        onChange={(e) => onChangeCurrent(e.target.value)}
        className="w-full bg-gray-100 text-black rounded-md px-4 py-2 border border-gray-200"
        required
      />

      <label className="block text-gray-600 text-sm mt-4" htmlFor="new-password">
        New Password
      </label>
      <input
        id="new-password"
        type="password"
        placeholder="Ex. A2h#H3j!k#"
        value={newPassword}
        onChange={(e) => onChangeNew(e.target.value)}
        className="w-full bg-gray-100 text-black rounded-md px-4 py-2 border border-gray-200"
        required
      />

      <label className="block text-gray-600 text-sm mt-4" htmlFor="repeat-password">
        Repeat New Password
      </label>
      <input
        id="repeat-password"
        type="password"
        placeholder="Ex. A2h#H3j!k#"
        value={repeatPassword}
        onChange={(e) => onChangeRepeat(e.target.value)}
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
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

import {PropsPasswordReadOnly} from "@/components/settings/types/types";

export function PasswordReadOnly({ onChangePassword }: PropsPasswordReadOnly) {
  return (
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
        onClick={onChangePassword}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onChangePassword()}
      >
        Change your password?
      </div>
    </>
  );
}

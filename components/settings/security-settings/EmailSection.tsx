import {PropsEmailSection} from "@/components/settings/types/types";

export function EmailSection({ email }: PropsEmailSection) {
  return (
    <>
      <label className="block text-gray-400 text-sm mb-1" htmlFor="email">
        E-mail
      </label>
      <input
        type="email"
        id="email"
        value={email}
        disabled
        className="w-full bg-gray-100 text-gray-400 cursor-not-allowed rounded-md px-4 py-2 mb-2 border border-gray-200"
      />
      <p className="text-xs text-gray-400 mb-6">
        For security reasons the email address cannot be modified as it is linked to this account
      </p>
    </>
  );
}

import React from "react";
import type { PropsProfileFormFields } from "../types/types";

export function ProfileFormFields({ form, profileType, onChange }: PropsProfileFormFields) {
  return (
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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

      {profileType === "player" ? (
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <span>
            <div className="mb-1">
              <label className="text-right pr-2 text-gray-400">Dominant Hand</label>
            </div>
            <div>
              <select
                name="dominantHand"
                value={form.dominantHand}
                onChange={onChange}
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
                onChange={onChange}
                className="border border-gray-100 w-full bg-[#F9F9F9] rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </span>
        </div>
      ) : null}
    </div>
  );
}

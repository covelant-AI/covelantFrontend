"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";

import { useAuth } from "@/app/context/AuthContext";
import type { PlayerData } from "@/util/interfaces";
import { inviteUrl } from "@/util/default";

import SearchUser from "@/components/UI/SearchUser";
import RadialBlurBg from "@/components/UI/RadialBlur";

import { InviteLinkCard } from "@/components/invite/InviteLinkCard";
import { InviteHelpNote } from "@/components/invite/InviteHelpNote";
import { SelectedUserCard } from "@/components/invite/SelectedUserCard";

import { toastCopyFailed, toastInviteFailed, toastInviteSuccess } from "@/components/invite/utils/toasts";
import { isSelectableUser, toPlayerData } from "@/components/invite/utils/toPlayerData";
import { sendInvite } from "@/components/invite/services/invite";

export default function InvitePage() {
  const { profile } = useAuth();

  const [selectedUser, setSelectedUser] = useState<PlayerData | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toastCopyFailed();
      Sentry.captureException(err);
    }
  }, []);

  const handleSelectUser = useCallback((user: unknown) => {
    if (!isSelectableUser(user)) return;
    setSelectedUser(toPlayerData(user));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedUser) return;
    const email = profile?.email;
    if (!email) {
      // no email => cannot send invite reliably
      toastInviteFailed();
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await sendInvite({ email, player: selectedUser });
      if (!res.ok) {
        toastInviteFailed();
        return;
      }

      setSelectedUser(null);
      toastInviteSuccess();
    } catch (err) {
      toastInviteFailed();
      Sentry.captureException(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedUser, profile?.email, isSubmitting]);

  return (
    <>
      <RadialBlurBg
        background={
          "radial-gradient(50% 30% at 50% 40%,rgba(8, 113, 151, 0.09) 27%,rgba(0, 180, 174, 0.13) 38%,rgba(176, 198, 255, 0) 100%)"
        }
        width={"auto"}
        height={"500"}
        rotate={"0deg"}
        top={"10vh"}
        left={"5vh"}
      />

      <div className="pt-40 min-h-screen bg-gray-100 flex flex-col items-center pt-24 space-y-10 px-4 z-10">
        <div className="text-4xl font-bold text-gray-900">Invite & Connect</div>

        <div className="flex flex-col md:flex-row md:space-x-2 space-y-6 justify-center max-md:items-center w-4/5 xl:w-3/4">
          <div className="w-full md:w-[420px] xl:w-[460px] shrink-0 z-10">
            <InviteLinkCard copied={copied} onCopy={handleCopy} />
            
            <div className="flex items-center text-gray-400 font-semibold py-4">
              <div className="flex-grow border-t border-gray-300" />
              <span className="mx-4 text-xl font-bold">or</span>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            <div className="">
              <SearchUser onSelect={handleSelectUser} />
            </div>

            <InviteHelpNote />
          </div>

          {selectedUser ? (
            <SelectedUserCard
              user={selectedUser}
              onClear={() => setSelectedUser(null)}
              onSubmit={handleSubmit}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}

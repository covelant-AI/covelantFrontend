"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import * as Sentry from "@sentry/nextjs";

import { EmailSection } from "./EmailSection";
import { PasswordReadOnly } from "./PasswordReadOnly";
import { PasswordChangeForm } from "./PasswordChangeForm";
import {
  toastAccessDenied,
  toastAuthDenied,
  toastMismatchPasswords,
  toastPasswordUpdated,
} from "../utils/toasts";

export default function SecuritySettings() {
  const { user } = useAuth();

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const resetForm = useCallback(() => {
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setRepeatPassword("");
  }, []);

  const handleSubmit = useCallback(async () => {
    // Preserve original logic intent: show mismatch toast in these cases
    if (!user || !user.email) {
      toastMismatchPasswords();
      return;
    }

    if (newPassword !== repeatPassword) {
      toastMismatchPasswords();
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      toastPasswordUpdated();
      resetForm();
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-credential") {
          toastAuthDenied();
          return;
        }

        toastAccessDenied();
        Sentry.captureException(error);
      }
    }
  }, [user, currentPassword, newPassword, repeatPassword, resetForm]);

  return (
    <div className="max-w-sm mx-auto bg-white font-sans">
      {!isChangingPassword && <EmailSection email={user?.email || ""} />}

      {!isChangingPassword ? (
        <PasswordReadOnly onChangePassword={() => setIsChangingPassword(true)} />
      ) : (
        <PasswordChangeForm
          currentPassword={currentPassword}
          newPassword={newPassword}
          repeatPassword={repeatPassword}
          onChangeCurrent={setCurrentPassword}
          onChangeNew={setNewPassword}
          onChangeRepeat={setRepeatPassword}
          onSubmit={handleSubmit}
          onCancel={() => setIsChangingPassword(false)}
        />
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as Sentry from "@sentry/nextjs";

import { useAuth } from "@/app/context/AuthContext";

import { createEmptyForm, DEFAULT_AVATAR } from "@/components/settings/types/types";
import type { ProfileForm } from "@/components/settings/types/types";

import { isFormChanged as isFormChangedUtil } from "../utils/formDiff";
import {
  toastDeletePictureError,
  toastFetchProfileError,
  toastProfilePictureDeleted,
  toastProfileUpdated,
  toastServerError,
  toastUpdateProfileError,
} from "../utils/toasts";

import { fetchUserProfile, updateUserProfile } from "../services/profile";
import { useAvatarUpload } from "../hooks/useAvatarUpload";

import { ProfileAvatarSection } from "@/components/settings/profile-settings/ProfileAvatarSection";
import { ProfileFormFields } from "@/components/settings/profile-settings/ProfileFormFields";
import { SaveButton } from "@/components/settings/profile-settings/SaveButton";

export default function ProfileSettings() {
  const { profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ProfileForm>(createEmptyForm());
  const [initialForm, setInitialForm] = useState<ProfileForm>(createEmptyForm());

  const { uploading, fileInputRef, openFilePicker, onFileSelected } = useAvatarUpload({
    email: profile?.email ?? "",
    onPreview: (localUrl) => setForm((prev) => ({ ...prev, avatar: localUrl })),
    onUploaded: (downloadUrl) => setForm((prev) => ({ ...prev, avatar: downloadUrl })),
  });

  useEffect(() => {
    if (!profile?.email) return;

    setLoading(true);

    fetchUserProfile(profile.email)
      .then(({ form: loaded, error }) => {
        if (error) {
          toastFetchProfileError();
          Sentry.captureException(error);
          return;
        }
        if (!loaded) return;

        setForm(loaded);
        setInitialForm(loaded);
      })
      .catch((err) => {
        toastFetchProfileError();
        Sentry.captureException(err);
      })
      .finally(() => setLoading(false));
  }, [profile?.email]);

  const isDirty = useMemo(() => isFormChangedUtil(form, initialForm), [form, initialForm]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (uploading) return;
    if (!profile?.type) return;

    const payload: Record<string, unknown> = { ...form, type: profile.type };

    try {
      const response = await updateUserProfile(payload);

      if (!response.ok) {
        toastUpdateProfileError();
      }

      toastProfileUpdated();
      window.location.reload();
    } catch (error) {
      toastServerError();
      Sentry.captureException(error);
    }
  };

  const handleDeletePicture = () => {
    // keep the same behavior: setForm + immediate update + reload
    setForm((prev) => ({ ...prev, avatar: DEFAULT_AVATAR }));

    if (!profile?.type) return;

    const payload: Record<string, unknown> = { ...form, avatar: DEFAULT_AVATAR, type: profile.type };

    updateUserProfile(payload)
      .then((res) => {
        if (!res.ok) {
          toastDeletePictureError();
        }
        toastProfilePictureDeleted();
        window.location.reload();
      })
      .catch((error) => {
        toastServerError();
        Sentry.captureException(error);
      });
  };

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading...
        <br />
        If it takes too long please refresh the page
      </p>
    );
  }

  return (
    <div className="px-20 py-4 max-w-2xl mx-auto flex flex-col gap-4 text-sm text-gray-700 max-md:px-4 max-md:py-6">
      <ProfileAvatarSection
        form={form}
        onChangePicture={openFilePicker}
        onDeletePicture={handleDeletePicture}
        fileInputRef={fileInputRef}
        onFileSelected={onFileSelected}
      />

      <ProfileFormFields form={form} profileType={profile?.type} onChange={handleChange} />

      <SaveButton disabled={!isDirty || uploading} uploading={uploading} onSave={handleSave} />
    </div>
  );
}

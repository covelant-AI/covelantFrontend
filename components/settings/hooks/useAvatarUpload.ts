import { useCallback, useRef, useState } from "react";
import * as Sentry from "@sentry/nextjs";

import { storage, ref, uploadBytesResumable, getDownloadURL } from "@/app/firebase/config";
import { toastImageNotValid, toastUploadError, toastUploadFailed, toastUploadReady } from "../utils/toasts";

export function useAvatarUpload(params: {
  email: string;
  onPreview: (localUrl: string) => void;
  onUploaded: (downloadUrl: string) => void;
}) {
  const { email, onPreview, onUploaded } = params;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // preview immediately
      const localUrl = URL.createObjectURL(file);
      onPreview(localUrl);

      try {
        if (!file.type.startsWith("image/")) {
          toastImageNotValid();
          return;
        }

        setUploading(true);

        const avatarRef = ref(storage, `avatars/${email}_${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(avatarRef, file);

        uploadTask.on(
          "state_changed",
          () => {
            /* progress… */
          },
          (error) => {
            toastUploadFailed();
            Sentry.captureException(error);
            setUploading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onUploaded(downloadURL);
            URL.revokeObjectURL(localUrl);
            toastUploadReady();
            setUploading(false);
          }
        );
      } catch (err) {
        toastUploadError();
        Sentry.captureException(err);
        setUploading(false);
      }
    },
    [email, onPreview, onUploaded]
  );

  return { uploading, fileInputRef, openFilePicker, onFileSelected };
}

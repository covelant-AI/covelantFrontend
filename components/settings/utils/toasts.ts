import { toast } from "react-toastify";
import { Msg } from "@/components/UI/ToastTypes";

const POS = "bottom-right" as const;

export function toastFetchProfileError() {
  toast.error(Msg, {
    data: {
      title: "Error fetching your profile",
      message:
        "Seams like we cannot fetch your profile data right now. Try checking your internet or try again later.",
    },
    position: POS,
  });
}

export function toastUpdateProfileError() {
  toast.error(Msg, {
    data: {
      title: "Failed to update profile",
      message:
        "Seams like we cannot update your profile data right now. Try checking your internet or try again later.",
    },
    position: POS,
  });
}

export function toastServerError() {
  toast.error(Msg, {
    data: {
      title: "Server Error",
      message:
        "There seems to be an error on our side, the error has been logged and we will fix it immidiatly. Please try again later.",
    },
    position: POS,
  });
}

export function toastDeletePictureError() {
  toast.error(Msg, {
    data: {
      title: "Failed to delete picture",
      message:
        "Seams like we cannot delete your profile picture right now. Try checking your internet or try again later.",
    },
    position: POS,
  });
}

export function toastImageNotValid() {
  toast.error(Msg, {
    data: {
      title: "Selected file is not an image",
      message: "The image you selected is not a valid image file. Please select a valid image file.",
    },
    position: POS,
  });
}

export function toastUploadFailed() {
  toast.error(Msg, {
    data: {
      title: "Upload failed",
      message: "There was an error uploading your image. Please try again later.",
    },
    position: POS,
  });
}

export function toastUploadError() {
  toast.error(Msg, {
    data: {
      title: "Upload Error",
      message: "There was an error uploading your image. Please try again later.",
    },
    position: POS,
  });
}

export function toastUploadReady() {
  toast.success("Image is ready for upload, Click save!", { position: POS });
}

export function toastProfileUpdated() {
  toast.success("Profile updated successfully!", { position: POS });
}

export function toastProfilePictureDeleted() {
  toast.success("Profile picture deleted successfully!", { position: POS });
}

export function toastMismatchPasswords() {
  toast.error(Msg, {
    data: {
      title: "Mismatch Passwords",
      message: "Looks like the new password and repeat password do not match. Please try again.",
    },
    position: POS,
  });
}

export function toastAuthDenied() {
  toast.error(Msg, {
    data: {
      title: "Authentication denied",
      message: "Looks like the current password is incorrect. Please try again.",
    },
    position: POS,
  });
}

export function toastAccessDenied() {
  toast.error(Msg, {
    data: {
      title: "Access denied",
      message: "password have been attempted to change to many times. Please try again later.",
    },
    position: POS,
  });
}

export function toastPasswordUpdated() {
  toast.success("Password updated successfully!");
}
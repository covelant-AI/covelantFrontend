import { toast } from "react-toastify";
import { Msg } from "@/components/UI/ToastTypes";

const POSITION = "bottom-right" as const;

export function toastCopyFailed() {
  toast.error(Msg, {
    data: {
      title: "Failed to copy link",
      message:
        "There was an error copying the invite link. Please copy it here at https://www.app.covelant.com/sign-up",
    },
    position: POSITION,
  });
}

export function toastInviteFailed() {
  toast.error(Msg, {
    data: {
      title: "Failed to Invite user",
      message:
        "There was a server error while inviting the user. You can invite them manually here at https://www.app.covelant.com/sign-up",
    },
    position: POSITION,
  });
}

export function toastInviteSuccess() {
  toast.success("Player added successfully!", { position: POSITION });
}

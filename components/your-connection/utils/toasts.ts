import { toast } from "react-toastify";
import { Msg } from "@/components/UI/ToastTypes";

export function toastFetchError() {
  toast.error(Msg, {
    data: {
      title: "Error Fetching Data",
      message: "Seems like we cannot load your data right now. Check your internet or try again later.",
    },
    position: "bottom-right",
  });
}

export function toastServerError() {
  toast.error(Msg, {
    data: {
      title: "Server Error",
      message: "Something went wrong while retrieving data from our servers. Please try again later.",
    },
    position: "bottom-right",
  });
}

export function toastDeleteFailed() {
  toast.error(Msg, {
    data: {
      title: "Failed to remove player",
      message: "Failed to remove from your connection list. Please try again later.",
    },
    position: "bottom-right",
  });
}

export function toastDeleteSuccess() {
  toast.success("Player removed successfully!", { position: "bottom-right" });
}

import { toast } from "react-toastify";
import { Msg } from "@/components/UI/ToastTypes";

export function showMatchDataErrorToast() {
  toast.error(Msg, {
    data: {
      title: "Error loading match data",
      message:
        "There was a problem with our servers while loading the match data. Please try again later or refresh the page.",
    },
    position: "bottom-right",
  });
}

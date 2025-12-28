import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/firebase/config";

export async function getFirebaseDownloadUrl(path: string): Promise<string> {
  return getDownloadURL(ref(storage, path));
}

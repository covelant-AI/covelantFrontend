import type { ProfileForm } from "../types/types";

export function isFormChanged(form: ProfileForm, initial: ProfileForm): boolean {
  return (
    form.firstName !== initial.firstName ||
    form.lastName !== initial.lastName ||
    form.dominantHand !== initial.dominantHand ||
    form.age !== initial.age ||
    form.height !== initial.height ||
    form.avatar !== initial.avatar
  );
}

export type ProfileForm = {
  firstName: string;
  lastName: string;
  dominantHand: string;
  age: number;
  height: number;
  email: string;
  avatar: string;
};

export const DEFAULT_AVATAR = "/images/default-avatar.png";

export function createEmptyForm(): ProfileForm {
  return {
    firstName: "",
    lastName: "",
    dominantHand: "Right Handed",
    age: 20,
    height: 180,
    email: "",
    avatar: DEFAULT_AVATAR,
  };
}


export type PropsProfileAvatarSection = {
  form: ProfileForm;
  onChangePicture: () => void;
  onDeletePicture: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelected: React.ChangeEventHandler<HTMLInputElement>;
};

export type PropsProfileFormFields = {
  form: ProfileForm;
  profileType?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};


export type PropsPasswordReadOnly = {
  onChangePassword: () => void;
};

export type PropsEmailSection = {
  email: string;
};
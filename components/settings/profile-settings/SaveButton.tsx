type Props = {
  disabled: boolean;
  uploading: boolean;
  onSave: () => void;
};

export function SaveButton({ disabled, uploading, onSave }: Props) {
  return (
    <div className="col-span-2 flex justify-center mt-6">
      <button
        onClick={onSave}
        disabled={disabled}
        className={`rounded-md px-20 py-2 font-semibold transition
          ${!disabled ? "bg-[#42B6B1] text-white hover:bg-teal-600 cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        type="button"
      >
        {uploading ? "Uploading…" : "Save"}
      </button>
    </div>
  );
}

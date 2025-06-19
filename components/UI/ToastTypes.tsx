export const Msg = ({ data }) => {
  return (
    <div className="max-w-xs p-4 bg-[#FEFEFE] text-black ">
      <div className="flex flex-row items-center justify-between">
        <div>
         <h3 className="text-md font-bold mb-2">{data.title}</h3>
          <p className="text-sm font-light">{data.message}</p>
        </div>
      </div>
    </div>
  );
};

import Image from "next/image";

export function ConnectionEmptyState() {
  return (
    <>
      <div className="max-md:hidden" />
      <div className="max-md:hidden" />

      <div className="flex flex-col items-center justify-center h-100 bg-white rounded-lg">
        <Image
          src="/images/noMatches.png"
          alt="No connections"
          width={500}
          height={300}
          className="max-w-full max-h-full object-contain mb-4"
        />
        <h3 className="text-black text-xl font-bold text-center">Oh no! You need some connections.</h3>
        <p className="text-gray-400 font-semibold text-center mt-2">
          You need to invite some people before accessing this page.
        </p>
      </div>
    </>
  );
}

export default function Loading() {
  return (
    <>
      <div role="status" className="animate-pulse">
        <div className="mb-3  flex  items-center gap-3">
          <div className="h-5 w-5 bg-gray-200"></div>
          <div className=" h-5 w-52 rounded-sm bg-gray-200"></div>
        </div>
        <div className="mb-3  flex  items-center gap-3">
          <div className="h-5 w-5 bg-gray-200"></div>
          <div className=" h-5 w-52 rounded-sm bg-gray-200"></div>
        </div>
        <div className="mb-3  flex  items-center gap-3">
          <div className="h-5 w-5 bg-gray-200"></div>
          <div className=" h-5 w-52 rounded-sm bg-gray-200"></div>
        </div>
        <div className="mb-3  flex  items-center gap-3">
          <div className="h-5 w-5 bg-gray-200"></div>
          <div className=" h-5 w-52 rounded-sm bg-gray-200"></div>
        </div>
        <div className="mb-3  flex  items-center gap-3">
          <div className="h-5 w-5 bg-gray-200"></div>
          <div className=" h-5 w-52 rounded-sm bg-gray-200"></div>
        </div>
        <div className="mb-3  flex  items-center gap-3">
          <div className="h-5 w-5 bg-gray-200"></div>
          <div className=" h-5 w-52 rounded-sm bg-gray-200"></div>
        </div>
      </div>
    </>
    // <div
    //   className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-gray-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
    //   role="status"
    // >
    //   <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
    //     Loading...
    //   </span>
    // </div>
  );
}

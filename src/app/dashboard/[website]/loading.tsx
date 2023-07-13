import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="w-full h-[40px] mb-[20px]" />
      <div className="flex items-center justify-center py-5 mt-8 gap-5">
        <Skeleton className="w-[22vw] h-[200px]" />
        <Skeleton className="w-[22vw] h-[200px]" />
        <Skeleton className="w-[22vw] h-[200px]" />
      </div>
      <div className="flex items-center justify-center mt-5 gap-5">
        <Skeleton className="w-[22vw] h-[200px]" />
        <Skeleton className="w-[22vw] h-[200px]" />
      </div>
      <div className="flex items-center mt-5 gap-5">
        <Skeleton className="w-[55%] h-[475px]" />
        <Skeleton className="w-[45%] h-[475px]" />
      </div>
    </>
  );
}

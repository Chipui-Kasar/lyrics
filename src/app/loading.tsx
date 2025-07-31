import PageLoader from "@/components/component/Spinner/Spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <PageLoader isLoading={true} />
    </div>
  );
}

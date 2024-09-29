import ReviewCard from "./_components/edit-review-card";

interface Props {
  searchParams?: {
    reviewId: string;
  };
}
const ReviewPage = async ({ searchParams }: Props) => {
  const reviewId = searchParams?.reviewId || "";
  return (
    <div className=" h-screen w-screen flex items-center justify-center bg-background text-foreground overflow-x-hidden">
      <ReviewCard reviewId={reviewId} />
    </div>
  );
};

export default ReviewPage;
